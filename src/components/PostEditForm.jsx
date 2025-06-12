/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import './PostEditForm.scss'

function PostEditForm({ post, onSave, onCancel }) {
  const [content, setContent] = useState(post?.content || '')
  const [publishAt, setPublishAt] = useState(post?.publishAt?.slice(0, 16) || '')
  const [mediaType, setMediaType] = useState(post?.mediaType || '')
  const [error, setError] = useState('')

  useEffect(() => {
    if (post) {
      setContent(post.content)
      setPublishAt(post.publishAt?.slice(0, 16) || '')
      setMediaType(post.mediaType || '')
    }
  }, [post])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return setError('Текст поста обязателен')
    if (!publishAt) return setError('Укажите дату публикации')

    try {
      const res = await fetch(`api/posts/${post.userId}/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, publishAt, mediaType })
      })

      if (!res.ok) throw new Error('Ошибка при обновлении поста')

      const updated = await res.json()
      onSave(updated)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form className="post-edit-form" onSubmit={handleSubmit}>
      <h3>Редактировать пост</h3>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Текст поста"
        required
      />
      <input
        type="datetime-local"
        value={publishAt}
        onChange={(e) => setPublishAt(e.target.value)}
        required
      />
      <input
        type="text"
        value={mediaType}
        onChange={(e) => setMediaType(e.target.value)}
        placeholder="Тип медиа (если есть)"
      />
      {error && <p className="error-message">{error}</p>}
      <button type="submit">Сохранить</button>
      <button type="button" onClick={onCancel}>Отмена</button>
    </form>
  )
}

export default PostEditForm