/* eslint-disable react/prop-types */
import { useState } from 'react'
import '../styles/PostForm.scss'

function PostForm({ userId, channels, onPostCreated }) {
  const [content, setContent] = useState('')
  const [selectedChannel, setSelectedChannel] = useState(channels[0]?.channelId || '')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) {
      setError('Пост не может быть пустым')
      return
    }
    if (!selectedChannel) {
      setError('Выберите канал')
      return
    }
    setError('')

    try {
      const res = await fetch(`http://77.105.133.23:8087/api/posts/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, channelId: selectedChannel }),
      })
      if (!res.ok) throw new Error('Ошибка при создании поста')
      const newPost = await res.json()
      onPostCreated(newPost)
      setContent('')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <h2>Создать пост</h2>
      <select
        value={selectedChannel}
        onChange={e => setSelectedChannel(e.target.value)}
        required
      >
        <option value="" disabled>Выберите канал</option>
        {channels.map(ch => (
          <option key={ch.channelId} value={ch.channelId}>{ch.channelId}</option>
        ))}
      </select>

      <textarea
        placeholder="Введите текст поста"
        value={content}
        onChange={e => setContent(e.target.value)}
        required
      />
      {error && <div className="error">{error}</div>}
      <button type="submit">Опубликовать</button>
    </form>
  )
}

export default PostForm
