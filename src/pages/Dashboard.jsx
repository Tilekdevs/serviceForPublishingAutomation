/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import ChannelList from '../components/ChannelList'
import ChannelForm from '../components/ChannelForm'
import PostForm from '../components/PostForm'
import '../styles/Dashboard.scss'

function Dashboard({ user, onLogout }) {
  const [posts, setPosts] = useState([])
  const [channels, setChannels] = useState([])

  const fetchChannels = async () => {
    try {
      const res = await fetch(`http://77.105.133.23:8087/api/channels/${user.id}`)
      const data = await res.json()
      setChannels(Array.isArray(data) ? data : data ? [data] : [])
    } catch (err) {
      console.error('Ошибка загрузки каналов:', err)
    }
  }

  useEffect(() => {
    if (!user?.id) return

    const fetchData = async () => {
      try {
        const [postRes, channelRes] = await Promise.all([
          fetch(`http://77.105.133.23:8087/api/posts/${user.id}`),
          fetch(`http://77.105.133.23:8087/api/channels/${user.id}`),
        ])

        const postData = await postRes.json()
        const channelData = await channelRes.json()

        setPosts(Array.isArray(postData) ? postData : [])
        setChannels(Array.isArray(channelData) ? channelData : channelData ? [channelData] : [])
      } catch (err) {
        console.error('Ошибка загрузки данных:', err)
      }
    }

    fetchData()
  }, [user?.id])

  const handleDeleteChannel = async (channelId) => {
    try {
      await fetch(`http://77.105.133.23:8087/api/channels/${user.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelId }),
      })
      setChannels(channels.filter((ch) => ch.channelId !== channelId))
    } catch (error) {
      console.error('Ошибка удаления канала:', error)
    }
  }

  return (
    <div className="dashboard-container">
      <button
        className="logout-button"
        onClick={() => {
          localStorage.removeItem('user')
          onLogout()
        }}
      >
        Выйти
      </button>

      <h1>Панель управления</h1>

      <div className="dashboard-section">
        <PostForm
          userId={user.id}
          channels={channels}
          onPostCreated={(newPost) => setPosts([...posts, newPost])}
        />
      </div>

      <div className="dashboard-section">
        <ChannelForm userId={user.id} onChannelAdded={fetchChannels} />
      </div>

      <div className="dashboard-section">
        <ChannelList channels={channels} onDelete={handleDeleteChannel} />
      </div>
    </div>
  )
}

export default Dashboard
