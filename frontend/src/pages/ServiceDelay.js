import React, { useState, useEffect } from 'react';
import { getCustomers } from '../utils/storage';

const ServiceDelay = () => {
  const [customers, setCustomers] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL || 'https://mkl-admin-backend.onrender.com/api';

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    const allCustomers = await getCustomers();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expired = allCustomers.filter(customer => {
      if (customer.followUpStatus === 'completed') return false;

      const serviceDate = customer.serviceDate ? new Date(customer.serviceDate) : new Date(customer.createdAt);
      const expireDate = new Date(serviceDate);
      expireDate.setMonth(expireDate.getMonth() + parseInt(customer.service || 0));
      expireDate.setHours(0, 0, 0, 0);

      return expireDate < today;
    });

    setCustomers(expired);
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
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Service Delay</h1>
        <p className="text-gray-600">Customers with expired services</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="text-white" style={{background: '#1e3a8a'}}>
              <tr>
                <th className="px-4 md:px-6 py-3 text-left text-sm">Name</th>
                <th className="px-4 md:px-6 py-3 text-left text-sm">Phone</th>
                <th className="px-4 md:px-6 py-3 text-left text-sm hidden md:table-cell">Area</th>
                <th className="px-4 md:px-6 py-3 text-left text-sm">Next Remainder</th>
                <th className="px-4 md:px-6 py-3 text-left text-sm">Expire Date</th>
                <th className="px-4 md:px-6 py-3 text-left text-sm">Delay</th>
                <th className="px-4 md:px-6 py-3 text-left text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, index) => {
                const serviceDate = customer.serviceDate ? new Date(customer.serviceDate) : new Date(customer.createdAt);
                const expireDate = new Date(serviceDate);
                expireDate.setMonth(expireDate.getMonth() + parseInt(customer.service || 0));
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                expireDate.setHours(0, 0, 0, 0);
                const daysDelayed = Math.floor((today - expireDate) / (1000 * 60 * 60 * 24));

                return (
                  <tr key={customer._id} style={{backgroundColor: index % 2 === 0 ? 'white' : '#1e3a8a1A'}}>
                    <td className="px-4 md:px-6 py-4 text-sm font-semibold" style={{color: '#1e3a8a'}}>{customer.name}</td>
                    <td className="px-4 md:px-6 py-4 text-sm">{customer.phone}</td>
                    <td className="px-4 md:px-6 py-4 text-sm hidden md:table-cell">{customer.area}</td>
                    <td className="px-4 md:px-6 py-4 text-sm">{customer.service}M</td>
                    <td className="px-4 md:px-6 py-4 text-sm text-red-600">{expireDate.toLocaleDateString('en-GB')}</td>
                    <td className="px-4 md:px-6 py-4 text-sm font-semibold text-red-600">{daysDelayed}d</td>
                    <td className="px-4 md:px-6 py-4 text-sm">
                      <select
                        value={customer.followUpStatus || 'pending'}
                        onChange={(e) => handleStatusChange(customer, e.target.value)}
                        className="px-3 py-1 rounded border text-sm"
                        style={{
                          color: customer.followUpStatus === 'completed' ? '#10b981' : '#ef4444',
                          borderColor: '#1e3a8a'
                        }}
                      >
                        <option value="pending">Service Not Done</option>
                        <option value="completed">Service Done</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {customers.length === 0 && (
          <div className="text-center py-8 text-gray-500">No delayed services</div>
        )}
      </div>
    </div>
  );
};

export default ServiceDelay;
