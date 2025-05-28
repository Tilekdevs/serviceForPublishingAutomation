/* eslint-disable react/prop-types */
import { useState } from 'react'
import '../styles/ChannelForm.scss'

function ChannelForm({ userId, onChannelAdded }) {
	const [channelId, setChannelId] = useState('')
	const [error, setError] = useState('')

	const isValidTelegramChannel = value => {
		return (
			/^@[\w\d_]{5,}$/.test(value) ||
			/^https?:\/\/t\.me\/[\w\d_]{5,}$/.test(value)
		)
	}

	const handleSubmit = async e => {
		e.preventDefault()
		if (!isValidTelegramChannel(channelId)) {
			setError(
				'Введите корректный Telegram канал, например @mychannel или https://t.me/mychannel',
			)
			return
		}
		setError('')

		if (!userId) {
			setError('Пользователь не авторизован')
			return
		}

		try {
			const user = JSON.parse(localStorage.getItem('user'))
			const token = user?.token || ''

			const res = await fetch(
				`http://localhost:8087/api/channels/${userId}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ channelId }),
				},
			)

			if (!res.ok) {
				const errData = await res.json()
				throw new Error(errData.message || 'Ошибка при добавлении канала')
			}

			setChannelId('')
			onChannelAdded()
		} catch (err) {
			setError(err.message)
			console.error(err)
		}
	}

	return (
		<form onSubmit={handleSubmit} className='channel-form'>
			<input
				type='text'
				placeholder='Введите Telegram канал (например @mychannel)'
				value={channelId}
				onChange={e => setChannelId(e.target.value)}
				className={error ? 'input-error' : ''}
			/>
			<button type='submit'>Добавить канал</button>
			{error && <p className='error-message'>{error}</p>}
		</form>
	)
}

export default ChannelForm
