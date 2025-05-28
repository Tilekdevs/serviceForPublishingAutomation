/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import '../styles/PostForm.scss'

function PostForm({ userId, channels, onPostCreated }) {
  const [content, setContent] = useState('')
  const [mediaType, setMediaType] = useState('')
  const [selectedChannel, setSelectedChannel] = useState(channels[0]?.channelId || '')
  const [publishNow, setPublishNow] = useState(false)
  const [publishDateTime, setPublishDateTime] = useState('')
  const [minDateTime, setMinDateTime] = useState('')
  const [error, setError] = useState('')

  // Обновляем минимальную дату для выбора при загрузке и каждую минуту
  useEffect(() => {
    const updateMinDateTime = () => {
      const now = new Date()
      const pad = n => n.toString().padStart(2, '0')
      const yyyy = now.getFullYear()
      const MM = pad(now.getMonth() + 1)
      const dd = pad(now.getDate())
      const HH = pad(now.getHours())
      const mm = pad(now.getMinutes())
      setMinDateTime(`${yyyy}-${MM}-${dd}T${HH}:${mm}`)
    }
    updateMinDateTime()
    const interval = setInterval(updateMinDateTime, 60 * 1000) // обновлять каждую минуту
    return () => clearInterval(interval)
  }, [])

  const formatDate = date => {
    const pad = n => n.toString().padStart(2, '0')
    return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')

    if (!content.trim()) {
      setError('Пост не может быть пустым')
      return
    }
    if (!selectedChannel) {
      setError('Выберите канал')
      return
    }

    let dateToFormat
    if (publishNow || !publishDateTime) {
      dateToFormat = new Date()
    } else {
      dateToFormat = new Date(publishDateTime)
      if (isNaN(dateToFormat)) {
        setError('Неверный формат даты и времени')
        return
      }
      // Проверка, что дата не в прошлом
      const now = new Date()
      if (dateToFormat < now) {
        setError('Дата и время публикации не могут быть в прошлом')
        return
      }
    }

    const formattedPublishTime = formatDate(dateToFormat)

    try {
      const res = await fetch(`http://localhost:8087/api/posts/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          publishTime: formattedPublishTime,
          channelId: selectedChannel,
          mediaType: mediaType || null,
        }),
      })

      if (!res.ok) {
        const errText = await res.text()
        throw new Error('Ошибка: ' + res.status + ' — ' + errText)
      }

      const newPost = await res.json()
      onPostCreated(newPost)
      setContent('')
      setMediaType('')
      setPublishNow(false)
      setPublishDateTime('')
    } catch (err) {
      setError(err.message)
      console.error('POST error:', err)
    }
  }

  return (
    <form className='post-form' onSubmit={handleSubmit}>
      <h2>Создать пост</h2>

      <select
        value={selectedChannel}
        onChange={e => setSelectedChannel(e.target.value)}
        required
      >
        <option value='' disabled>
          Выберите канал
        </option>
        {channels.map(ch => (
          <option key={ch.channelId} value={ch.channelId}>
            {ch.channelId}
          </option>
        ))}
      </select>

      <textarea
        placeholder='Введите текст поста'
        value={content}
        onChange={e => setContent(e.target.value)}
        required
      />

      <label>
        <input
          type='checkbox'
          checked={publishNow}
          onChange={e => setPublishNow(e.target.checked)}
        />
        Опубликовать сразу
      </label>

      {!publishNow && (
        <input
          type='datetime-local'
          value={publishDateTime}
          onChange={e => setPublishDateTime(e.target.value)}
          min={minDateTime}
          required
        />
      )}

      {error && <div className='error'>{error}</div>}
      <button type='submit'>Опубликовать</button>
    </form>
  )
}

export default PostForm
