import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplets, Shield, Clock, Award, Phone, Mail, MapPin } from 'lucide-react';
import logo from '../assets/logo.JPG';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <img src={logo} alt="MKL Enterprises" className="h-12 md:h-16" />
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Admin Login
          </button>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-blue-900 mb-6">
              Pure Water, Pure Life
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Premium water purifier rental services for your home and office. Affordable plans starting from 3 months.
            </p>
            <div className="flex gap-4">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                Get Started
              </button>
              <button className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-semibold">
                Learn More
              </button>
            </div>
          </div>
          <div className="flex justify-center">
            <Droplets size={300} className="text-blue-400 opacity-20" />
          </div>
        </div>
      </section>

      <section className="bg-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose MKL?</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <Shield size={48} className="mx-auto mb-4 text-blue-300" />
              <h3 className="text-xl font-bold mb-2">Certified Quality</h3>
              <p className="text-blue-200">ISO certified purification systems</p>
            </div>
            <div className="text-center">
              <Clock size={48} className="mx-auto mb-4 text-blue-300" />
              <h3 className="text-xl font-bold mb-2">Flexible Plans</h3>
              <p className="text-blue-200">3, 6, and 12 month rental options</p>
            </div>
            <div className="text-center">
              <Award size={48} className="mx-auto mb-4 text-blue-300" />
              <h3 className="text-xl font-bold mb-2">Expert Service</h3>
              <p className="text-blue-200">Regular maintenance included</p>
            </div>
            <div className="text-center">
              <Droplets size={48} className="mx-auto mb-4 text-blue-300" />
              <h3 className="text-xl font-bold mb-2">Pure Water</h3>
              <p className="text-blue-200">99.9% purification guaranteed</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-12">Our Plans</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-blue-200 hover:border-blue-500 transition-colors">
            <h3 className="text-2xl font-bold text-blue-900 mb-4">3 Months</h3>
            <p className="text-4xl font-bold text-blue-600 mb-6">₹1,500</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">✓ Free Installation</li>
              <li className="flex items-center gap-2">✓ 1 Free Service</li>
              <li className="flex items-center gap-2">✓ 24/7 Support</li>
            </ul>
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Choose Plan
            </button>
          </div>
          <div className="bg-blue-600 text-white rounded-lg shadow-lg p-8 transform scale-105">
            <h3 className="text-2xl font-bold mb-4">6 Months</h3>
            <p className="text-4xl font-bold mb-6">₹2,700</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">✓ Free Installation</li>
              <li className="flex items-center gap-2">✓ 2 Free Services</li>
              <li className="flex items-center gap-2">✓ Priority Support</li>
            </ul>
            <button className="w-full bg-white text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition-colors font-semibold">
              Choose Plan
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-blue-200 hover:border-blue-500 transition-colors">
            <h3 className="text-2xl font-bold text-blue-900 mb-4">12 Months</h3>
            <p className="text-4xl font-bold text-blue-600 mb-6">₹4,800</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">✓ Free Installation</li>
              <li className="flex items-center gap-2">✓ 4 Free Services</li>
              <li className="flex items-center gap-2">✓ Premium Support</li>
            </ul>
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Choose Plan
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-blue-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <img src={logo} alt="MKL Enterprises" className="h-16 mb-4 bg-white p-2 rounded" />
              <p className="text-blue-200">We Care About What You Drink</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <div className="space-y-2 text-blue-200">
                <p className="flex items-center gap-2"><Phone size={16} /> +91 1234567890</p>
                <p className="flex items-center gap-2"><Mail size={16} /> support@mklenterprises.com</p>
                <p className="flex items-center gap-2"><MapPin size={16} /> Hyderabad, India</p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-blue-200">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Services</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><button onClick={() => navigate('/login')} className="hover:text-white">Admin Login</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-300">
            <p>&copy; 2024 MKL Enterprises. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
