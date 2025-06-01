/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import PostList from '../components/PostList'
import PostForm from '../components/PostForm'
import '../styles/Dashboard.scss'

function Dashboard({ user, onLogout }) {
	const [channels, setChannels] = useState([])
	const [posts, setPosts] = useState([])
	const [editingPost, setEditingPost] = useState(null)
	const [editContent, setEditContent] = useState('')
	const [editMediaType, setEditMediaType] = useState('')

	useEffect(() => {
		if (!user?.userId) return

		const fetchData = async () => {
			try {
				const [channelRes, postRes] = await Promise.all([
					fetch(`http://localhost:8087/api/channels/${user.userId}`),
					fetch(`http://localhost:8087/api/posts/${user.userId}`),
				])

				const channelData = await channelRes.json()
				const postData = await postRes.json()

				setChannels(
					Array.isArray(channelData)
						? channelData
						: channelData
						? [channelData]
						: [],
				)
				setPosts(Array.isArray(postData) ? postData : [])
			} catch (error) {
				console.error('Ошибка загрузки:', error)
			}
		}

		fetchData()
	}, [user?.userId])

	const handleDeleteChannel = async channelId => {
		try {
			await fetch(`http://localhost:8087/api/channels/${user.userId}`, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ channelId }),
			})
			setChannels(prev => prev.filter(c => c.channelId !== channelId))
		} catch (error) {
			console.error('Ошибка удаления канала:', error)
		}
	}

	const handleDeletePost = async postId => {
		try {
			await fetch(`http://localhost:8087/api/posts/${user.userId}/${postId}`, {
				method: 'DELETE',
			})
			setPosts(prev => prev.filter(p => p.id !== postId))
		} catch (error) {
			console.error('Ошибка удаления поста:', error)
		}
	}

	const handleEditPost = post => {
		setEditingPost(post)
		setEditContent(post.content)
		setEditMediaType(post.mediaType || '')
	}

	const handleSaveEdit = async () => {
		if (!editingPost) return

		try {
			const res = await fetch(
				`http://localhost:8087/api/posts/${user.userId}/${editingPost.id}`,
				{
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						content: editContent,
						mediaType: editMediaType,
					}),
				},
			)

			if (!res.ok) throw new Error('Ошибка при сохранении поста')

			const updatedPost = await res.json()

			setPosts(prev =>
				prev.map(p => (p.id === updatedPost.id ? updatedPost : p)),
			)

			setEditingPost(null)
		} catch (error) {
			alert('Ошибка: ' + error.message)
		}
	}

	const handlePublishPost = async postId => {
		try {
			const res = await fetch(
				`http://localhost:8087/api/posts/${user.userId}/${postId}/publish`,
				{
					method: 'POST',
				},
			)
			if (!res.ok) throw new Error('Ошибка при публикации поста')

			const updatedPost = await res.json()

			setPosts(prev =>
				prev.map(p => (p.id === updatedPost.id ? updatedPost : p)),
			)
		} catch (error) {
			alert('Ошибка публикации: ' + error.message)
		}
	}

	const handleCancelEdit = () => {
		setEditingPost(null)
	}

	const handlePostCreated = newPost => {
		setPosts(prev => [newPost, ...prev])
	}

	return (
		<div className='dashboard-container'>
			<button className='logout-button' onClick={onLogout}>
				Выйти
			</button>

			<h1>Панель редактирования</h1>

			<h2>Пользователь: @{user.telegramUsername}</h2>

			<section>
				<h3>Каналы:</h3>
				{channels.length === 0 ? (
					<p>Нет подключенных каналов</p>
				) : (
					<ul>
						{channels.map(channel => (
							<li key={channel.id}>
								<span>{channel.channelId}</span>
								<button onClick={() => handleDeleteChannel(channel.channelId)}>
									Удалить
								</button>
							</li>
						))}
					</ul>
				)}
			</section>

			<section>
				<PostForm
					userId={user.userId}
					channels={channels}
					onPostCreated={handlePostCreated}
				/>
			</section>

			<section>
				<PostList
					posts={posts}
					onDelete={handleDeletePost}
					onEdit={handleEditPost}
					onPublish={handlePublishPost}
				/>
			</section>

			{editingPost && (
				<div className='edit-post-modal'>
					<h3>Редактирование поста</h3>
					<textarea
						value={editContent}
						onChange={e => setEditContent(e.target.value)}
						rows={4}
					/>
					<input
						type='text'
						value={editMediaType}
						onChange={e => setEditMediaType(e.target.value)}
						placeholder='Тип медиа (например: image, video)'
					/>
					<div className='buttons'>
						<button onClick={handleSaveEdit}>Сохранить</button>
						<button onClick={handleCancelEdit}>Отмена</button>
					</div>
				</div>
			)}
		</div>
	)
}

export default Dashboard
