import React, { useState, useEffect } from 'react';
import { Send, CheckCircle, Phone } from 'lucide-react';
import { getCustomers } from '../utils/storage';

const ExpiryAlerts = () => {
  const [expiringCustomers, setExpiringCustomers] = useState([]);
  const [followUpStatus, setFollowUpStatus] = useState({});

  useEffect(() => {
    const loadData = async () => {
      const customers = await getCustomers();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const expiring = customers.filter(customer => {
        const parseDate = (dateStr) => {
          if (!dateStr) return null;
          const [year, month, day] = dateStr.split('-');
          return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        };
        
        const serviceDate = customer.serviceDate 
          ? parseDate(customer.serviceDate) 
          : new Date(customer.createdAt);
        const expireDate = new Date(serviceDate);
        expireDate.setMonth(expireDate.getMonth() + parseInt(customer.service || 0));
        expireDate.setHours(0, 0, 0, 0);
        
        const daysUntilExpiry = Math.floor((expireDate - today) / (1000 * 60 * 60 * 24));
        
        return daysUntilExpiry >= 0 && daysUntilExpiry <= 7;
      });
      
      setExpiringCustomers(expiring);
    };
    loadData();
  }, []);

  const sendReminder = (customer) => {
    alert(`Reminder sent to ${customer.name} at ${customer.email}`);
  };

  const handleFollowUp = (customerId) => {
    setFollowUpStatus(prev => ({ ...prev, [customerId]: !prev[customerId] }));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Services - Follow Up</h1>
        <p className="text-gray-600">Customers requiring subscription renewal follow-up</p>
      </div>

      {expiringCustomers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-teal-900 mt-4">All Clear!</h2>
          <p className="text-teal-600 mt-2">No subscriptions requiring follow-up</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <tr>
                  <th className="px-4 md:px-6 py-3 text-left text-sm whitespace-nowrap">Customer Name</th>
                  <th className="px-4 md:px-6 py-3 text-left text-sm">Phone</th>
                  <th className="px-4 md:px-6 py-3 text-left text-sm hidden md:table-cell">Email</th>
                  <th className="px-4 md:px-6 py-3 text-left text-sm">Service</th>
                  <th className="px-4 md:px-6 py-3 text-left text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expiringCustomers.map((customer, index) => (
                  <tr 
                    key={customer._id || customer.id} 
                    className={`transition-all hover:bg-blue-100 ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50'}`}
                  >
                    <td className="px-4 md:px-6 py-4 text-sm font-semibold text-blue-700 whitespace-nowrap">{customer.name}</td>
                    <td className="px-4 md:px-6 py-4 text-sm whitespace-nowrap">{customer.phone}</td>
                    <td className="px-4 md:px-6 py-4 text-sm hidden md:table-cell">{customer.email}</td>
                    <td className="px-4 md:px-6 py-4 text-sm">{customer.service}M</td>
                    <td className="px-4 md:px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => sendReminder(customer)} 
                          className="text-blue-600 hover:text-blue-800 hover:scale-110 transition-transform"
                          title="Send Reminder"
                        >
                          <Send size={18} />
                        </button>
                        <button 
                          onClick={() => handleFollowUp(customer._id || customer.id)} 
                          className={`hover:scale-110 transition-transform ${followUpStatus[customer._id || customer.id] ? 'text-green-600' : 'text-gray-400'}`}
                          title="Mark Follow Up"
                        >
                          <Phone size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpiryAlerts;
