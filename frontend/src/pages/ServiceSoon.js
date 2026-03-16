import React, { useState, useEffect } from 'react';
import { getCustomers } from '../utils/storage';
import Table from '../components/Table';

const ServiceSoon = () => {
  const [customers, setCustomers] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL || 'https://mkl-admin-backend.onrender.com/api';

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    const allCustomers = await getCustomers();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiring = allCustomers.filter(customer => {
      if (customer.followUpStatus === 'completed') return false;

      const serviceDate = customer.serviceDate ? new Date(customer.serviceDate) : new Date(customer.createdAt);
      const expireDate = new Date(serviceDate);
      expireDate.setMonth(expireDate.getMonth() + parseInt(customer.service || 0));
      expireDate.setHours(0, 0, 0, 0);

      const daysUntilExpiry = Math.floor((expireDate - today) / (1000 * 60 * 60 * 24));

      return daysUntilExpiry >= 0 && daysUntilExpiry <= 7;
    });

    setCustomers(expiring);
  };

  const handleStatusChange = async (customer, status) => {
    try {
      await fetch(`${API_URL}/customers/${customer._id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      if (status === 'completed') {
        const newExpireDate = new Date();
        newExpireDate.setMonth(newExpireDate.getMonth() + parseInt(customer.service || 3));
        
        await fetch(`${API_URL}/customers/${customer._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            serviceDate: new Date().toISOString().split('T')[0],
            followUpStatus: 'pending'
          })
        });
      }
      
      loadCustomers();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Service Soon</h1>
        <p className="text-gray-600">Customers with services expiring within 7 days</p>
      </div>

      <Table
        columns={[
          { header: 'Name', field: 'name', bold: true, color: '#1e3a8a' },
          { header: 'Phone', field: 'phone' },
          { header: 'Area', field: 'area', hideOnMobile: true },
          { header: 'Next Remainder', render: (customer) => `${customer.service}M` },
          { header: 'Expire Date', render: (customer) => {
            const serviceDate = customer.serviceDate ? new Date(customer.serviceDate) : new Date(customer.createdAt);
            const expireDate = new Date(serviceDate);
            expireDate.setMonth(expireDate.getMonth() + parseInt(customer.service || 0));
            return expireDate.toLocaleDateString('en-GB');
          }},
          { header: 'Days Left', render: (customer) => {
            const serviceDate = customer.serviceDate ? new Date(customer.serviceDate) : new Date(customer.createdAt);
            const expireDate = new Date(serviceDate);
            expireDate.setMonth(expireDate.getMonth() + parseInt(customer.service || 0));
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            expireDate.setHours(0, 0, 0, 0);
            const daysLeft = Math.floor((expireDate - today) / (1000 * 60 * 60 * 24));
            return <span className="font-semibold text-orange-600">{daysLeft}d</span>;
          }},
          { header: 'Status', stopPropagation: true, render: (customer) => (
            <select
              value={customer.followUpStatus || 'pending'}
              onChange={(e) => handleStatusChange(customer, e.target.value)}
              className="px-3 py-1 rounded border text-sm"
              style={{
                color: customer.followUpStatus === 'completed' ? '#10b981' : '#f59e0b',
                borderColor: '#1e3a8a'
              }}
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          )}
        ]}
        data={customers}
        emptyMessage="No services expiring soon"
      />
    </div>
  );
};

export default ServiceSoon;
