import { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import ToiletTracker from './components/ToiletTracker';
import Statistics from './components/Statistics';
import Navigation from './components/Navigation';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('tracker');
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setShowLogin(true);
  };

  const switchToRegister = () => setShowLogin(false);
  const switchToLogin = () => setShowLogin(true);

  return (
    <Router>
      <div className='App'>
        {!isAuthenticated ? (
          showLogin ? (
            <Login setIsAuthenticated={setIsAuthenticated} switchToRegister={switchToRegister} />
          ) : (
            <Register setIsAuthenticated={setIsAuthenticated} switchToLogin={switchToLogin} />
          )
        ) : (
          <>
            <Navigation activeTab={activeTab} setActiveTab={setActiveTab} handleLogout={handleLogout} />
            <main className='main-content'>{activeTab === 'tracker' ? <ToiletTracker /> : <Statistics />}</main>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
