/* eslint-disable react/prop-types */
import { useNavigate } from 'react-router-dom'
import '../styles/Home.scss'

function Home({ user }) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (user?.userId) {
      navigate('/dashboard')
    } else {
      navigate('/login')
    }
  }

  return (
    <div className="home-page">
      <header className="home-header">
        <h1 className="home-title">Управляйте вашими Telegram-каналами</h1>
        <p className="home-subtitle">
          Создавайте посты, добавляйте каналы и публикуйте контент легко и быстро
        </p>
      </header>
      <section className="home-info">
        <h2 className="home-info-title">Как начать?</h2>
        <p className="home-info-text">
          Для входа используйте ваш Telegram ID и пароль, установленный через команду <b>/password</b> в нашем Telegram-боте.
        </p>
        <button className="home-login-button" onClick={handleClick}>
          {user?.userId ? 'Перейти в панель' : 'Войти'}
        </button>
      </section>
    </div>
  )
}

export default Home
