import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email.');
      return false;
    }
    if (!password) {
      setError('Please enter your password.');
      return false;
    }
    setError('');
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await axios.post('/api/auth/login', { email, password });
      // Store token or necessary data if login succeeds
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials, please try again.');
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center text-gray-900">Log In</h2>
      {error && <p className="text-center text-red-500">{error}</p>}
      <form className="space-y-6" onSubmit={handleLogin}>
        <div>
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Sign In
        </button>
      </form>
      <p className="text-sm text-center text-gray-600">
        Don't have an account?{' '}
        <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
          Register
        </Link>
      </p>
    </div>
  );
}

export default Login;
