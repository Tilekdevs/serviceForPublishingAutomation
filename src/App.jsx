import { useState } from 'react';
import LoginForm from './components/LoginForm';
import Dashboard from './pages/Dashboard';
import "./styles/index.css"

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return user ? (
    <Dashboard user={user} onLogout={handleLogout} />
  ) : (
    <div className='LoginApp'>
      <LoginForm onLogin={handleLogin} />
    </div>
  );
}

export default App;