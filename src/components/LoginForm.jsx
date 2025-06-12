/* eslint-disable react/prop-types */
import { useState } from 'react'
import '../styles/LoginForm.scss'

function LoginForm({ onLogin }) {
	const [form, setForm] = useState({ username: '', password: '' })

	const handleSubmit = async e => {
		e.preventDefault()
		try {
			const res = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					username: form.username,
					password: form.password,
				}),
			})

			const text = await res.text()
			let data
			try {
				data = JSON.parse(text)
			} catch {
				data = { message: text }
			}

			if (!res.ok) throw new Error(data.message || 'Ошибка входа')

			onLogin(data)
		} catch (err) {
			alert('Ошибка: ' + err.message)
		}
	}

	return (
		<form onSubmit={handleSubmit} className='login-form'>
			<h2>Вход</h2>
			<input
				type='text'
				placeholder='Юзернейм тг'
				value={form.username}
				onChange={e => setForm({ ...form, username: e.target.value })}
			/>
			<input
				type='password'
				placeholder='Пароль'
				value={form.password}
				onChange={e => setForm({ ...form, password: e.target.value })}
			/>
			<button type='submit'>Войти</button>
		</form>
	)
}
export default LoginForm
