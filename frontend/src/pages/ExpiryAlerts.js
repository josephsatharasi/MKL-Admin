import React, { useState, useEffect } from 'react';
import { Send, CheckCircle, Phone } from 'lucide-react';
import { getCustomers, getDaysUntilExpiry } from '../utils/storage';

const ExpiryAlerts = () => {
  const [expiringCustomers, setExpiringCustomers] = useState([]);
  const [followUpStatus, setFollowUpStatus] = useState({});

  useEffect(() => {
    const customers = getCustomers();
    const expiring = customers.filter(c => {
      const days = getDaysUntilExpiry(c.endDate);
      return days > 0 && days <= 30;
    }).sort((a, b) => getDaysUntilExpiry(a.endDate) - getDaysUntilExpiry(b.endDate));
    
    setExpiringCustomers(expiring);
  }, []);

  const sendReminder = (customer) => {
    alert(`Reminder sent to ${customer.name} at ${customer.email}`);
  };

  const handleFollowUp = (customerId) => {
    setFollowUpStatus(prev => ({ ...prev, [customerId]: !prev[customerId] }));
  };

  const getDaysColor = (days) => {
    if (days <= 7) return 'text-red-600 font-bold';
    if (days <= 15) return 'text-orange-600 font-semibold';
    return 'text-yellow-600';
  };

  const getStatusBadge = (days) => {
    if (days <= 7) return <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs">Urgent</span>;
    if (days <= 15) return <span className="px-3 py-1 bg-orange-500 text-white rounded-full text-xs">Soon</span>;
    return <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-xs">Upcoming</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-900 mb-2">Services - Follow Up</h1>
        <p className="text-blue-600">Customers requiring subscription renewal follow-up</p>
      </div>

      {expiringCustomers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-blue-900 mt-4">All Clear!</h2>
          <p className="text-blue-600 mt-2">No subscriptions requiring follow-up</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <tr>
                  <th className="px-4 md:px-6 py-3 text-left text-sm">Customer Name</th>
                  <th className="px-4 md:px-6 py-3 text-left text-sm">Phone</th>
                  <th className="px-4 md:px-6 py-3 text-left text-sm hidden md:table-cell">Email</th>
                  <th className="px-4 md:px-6 py-3 text-left text-sm">Plan</th>
                  <th className="px-4 md:px-6 py-3 text-left text-sm">End Date</th>
                  <th className="px-4 md:px-6 py-3 text-left text-sm">Days Left</th>
                  <th className="px-4 md:px-6 py-3 text-left text-sm">Status</th>
                  <th className="px-4 md:px-6 py-3 text-left text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expiringCustomers.map((customer, index) => {
                  const days = getDaysUntilExpiry(customer.endDate);
                  return (
                    <tr 
                      key={customer.id} 
                      className={`transition-all hover:bg-blue-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                    >
                      <td className="px-4 md:px-6 py-4 text-sm font-semibold text-blue-900">{customer.name}</td>
                      <td className="px-4 md:px-6 py-4 text-sm">{customer.phone}</td>
                      <td className="px-4 md:px-6 py-4 text-sm hidden md:table-cell">{customer.email}</td>
                      <td className="px-4 md:px-6 py-4 text-sm">{customer.plan}M</td>
                      <td className="px-4 md:px-6 py-4 text-sm">{customer.endDate}</td>
                      <td className="px-4 md:px-6 py-4 text-sm">
                        <span className={getDaysColor(days)}>{days} days</span>
                      </td>
                      <td className="px-4 md:px-6 py-4 text-sm">{getStatusBadge(days)}</td>
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
                            onClick={() => handleFollowUp(customer.id)} 
                            className={`hover:scale-110 transition-transform ${followUpStatus[customer.id] ? 'text-green-600' : 'text-gray-400'}`}
                            title="Mark Follow Up"
                          >
                            <Phone size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpiryAlerts;
