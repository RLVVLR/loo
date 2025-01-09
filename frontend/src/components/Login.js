import React, { useState } from 'react';

function Login({ setIsAuthenticated, switchToRegister }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      setIsAuthenticated(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className='auth-container'>
      <form onSubmit={handleSubmit} className='auth-form'>
        <h2>Welcome Back</h2>

        {error && <div className='error-message'>{error}</div>}

        <div className='form-group'>
          <label htmlFor='username'>Username</label>
          <input type='text' id='username' name='username' value={formData.username} onChange={handleChange} placeholder='Enter your username' required />
        </div>

        <div className='form-group'>
          <label htmlFor='password'>Password</label>
          <input type='password' id='password' name='password' value={formData.password} onChange={handleChange} placeholder='Enter your password' required />
        </div>

        <button type='submit' className='auth-button'>
          Login
        </button>

        <div className='auth-switch'>
          Don't have an account?
          <button type='button' onClick={switchToRegister} className='switch-button'>
            Register
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
