import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, CheckCircle, AlertTriangle, XCircle, UserPlus } from 'lucide-react';
import { getCustomers } from '../utils/storage';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expiringSoon: 0,
    expired: 0,
  });

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const customers = await getCustomers();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      let expiringSoon = 0;
      let expired = 0;
      
      customers.forEach(customer => {
        if (customer.followUpStatus === 'completed') return;
        
        const serviceDate = customer.serviceDate ? new Date(customer.serviceDate) : new Date(customer.createdAt);
        const expireDate = new Date(serviceDate);
        expireDate.setMonth(expireDate.getMonth() + parseInt(customer.service || 0));
        expireDate.setHours(0, 0, 0, 0);
        
        const daysUntilExpiry = Math.floor((expireDate - today) / (1000 * 60 * 60 * 24));
        
        if (daysUntilExpiry < 0) {
          expired++;
        } else if (daysUntilExpiry <= 7) {
          expiringSoon++;
        }
      });
      
      setStats({
        total: customers.length,
        active: customers.length,
        expiringSoon,
        expired,
      });
    };
    loadData();
  }, []);

  const cards = [
    { title: 'Total Customers', value: stats.total, icon: Users, color: 'bg-blue-50', link: '/admin/customers' },
    { title: 'Total Service Customers', value: stats.active, icon: CheckCircle, color: 'bg-blue-50', link: '/admin/current-month-customers' },
    { title: 'Service Soon', value: stats.expiringSoon, icon: AlertTriangle, color: 'bg-blue-50', link: '/admin/service-soon' },
    { title: 'Service Delay', value: stats.expired, icon: XCircle, color: 'bg-blue-50', link: '/admin/service-delay' },
  ];

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Link key={index} to={card.link}>
              <div className={`${card.color} rounded-xl shadow-lg p-6 hover:scale-105 transition-transform cursor-pointer`} style={{backgroundColor: '#1e3a8a1A'}}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-700">{card.title}</p>
                    <p className="text-4xl font-bold mt-2 text-gray-900">{card.value}</p>
                  </div>
                  <Icon size={48} className="text-gray-700" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="rounded-xl shadow-lg p-6 bg-white border border-gray-200 max-w-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="space-y-3">
          <Link to="/admin/add-customer" className="flex items-center gap-2 w-full text-white py-3 px-4 rounded-lg transition-colors font-semibold shadow-md" style={{background: '#1e3a8a'}}>
            <UserPlus size={20} />
            Add New Customer
          </Link>
          <Link to="/admin/new-services" className="flex items-center gap-2 w-full bg-yellow-500 text-white py-3 px-4 rounded-lg hover:bg-yellow-600 transition-colors font-semibold shadow-md">
            <AlertTriangle size={20} />
            View Expiry Alerts
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
