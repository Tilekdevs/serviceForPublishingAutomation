/* eslint-disable react/prop-types */
import { useState } from 'react'
import '../styles/LoginForm.scss'

function LoginForm({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('http://77.105.133.23:8087/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: '*/*',
        },
        body: JSON.stringify({
          username: form.username, // ← теперь правильно
          password: form.password,
        }),
      })

      if (!res.ok) throw new Error('Ошибка входа: ' + res.status)

      const data = await res.json()

      // Приводим к общему виду, чтобы сохранить в localStorage
      const user = {
        id: data.userId,
        telegramId: data.telegramId,
      }

      localStorage.setItem('user', JSON.stringify(user))
      onLogin(user)
    } catch (err) {
      alert('Ошибка: ' + err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Вход</h2>
      <input
        type="text"
        placeholder="Телеграм ID"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="Пароль"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
      />
      <button type="submit">Войти</button>
    </form>
  )
}

export default LoginForm
