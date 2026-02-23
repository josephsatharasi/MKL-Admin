import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import logo from '../assets/logo.JPG';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Login = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!credentials.email || !credentials.password) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setIsLoggedIn(true);
        navigate('/admin');
      } else {
        console.error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4" style={{
      background: 'linear-gradient(to bottom, #f0f4f8 0%, #e8f0f7 50%, #ffffff 100%)'
    }}>
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 810" preserveAspectRatio="none">
        <path fill="#5b8fc7" fillOpacity="0.3" d="M0,400 C300,500 600,450 900,400 C1200,350 1350,380 1440,400 L1440,810 L0,810 Z"></path>
        <path fill="#4a7bb7" fillOpacity="0.5" d="M0,450 C350,550 650,500 950,450 C1250,400 1380,430 1440,450 L1440,810 L0,810 Z"></path>
        <path fill="#1e5a9e" fillOpacity="0.7" d="M0,500 C400,600 700,550 1000,500 C1300,450 1400,480 1440,500 L1440,810 L0,810 Z"></path>
        <path fill="#0d4a8f" d="M0,550 C450,650 750,600 1050,550 C1350,500 1420,530 1440,550 L1440,810 L0,810 Z"></path>
      </svg>
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <img src={logo} alt="MKL Enterprises" className="h-24 w-auto mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-blue-700">Admin Login</h1>
          <p className="text-gray-600 mt-2">Access your admin dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-blue-700 mb-2">Email <span className="text-red-500">*</span></label>
            <input
              type="email"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-blue-700 mb-2">Password <span className="text-red-500">*</span></label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogIn size={20} />
            {loading ? 'Logging in...' : 'Login to Dashboard'}
          </button>
        </form>

        <div className="text-center text-sm text-gray-600 mt-4">
          <Link to="/forgot-password" className="text-blue-600 font-semibold hover:underline">Forgot Password?</Link>
        </div>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account? <Link to="/register" className="text-blue-600 font-semibold hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
