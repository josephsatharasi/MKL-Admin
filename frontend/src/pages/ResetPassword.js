import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock } from 'lucide-react';
import logo from '../assets/logo.JPG';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.password || !formData.confirmPassword) {
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: formData.password })
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/');
      } else {
        console.error(data.message || 'Failed to reset password');
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
          <h1 className="text-3xl font-bold text-blue-700">Reset Password</h1>
          <p className="text-gray-600 mt-2">Enter your new password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-blue-700 mb-2">New Password <span className="text-red-500">*</span></label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-blue-700 mb-2">Confirm Password <span className="text-red-500">*</span></label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm new password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Lock size={20} />
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
