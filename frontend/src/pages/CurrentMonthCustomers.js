import React, { useState, useEffect } from 'react';
import { getCustomers } from '../utils/storage';
import CustomerDetails from '../components/CustomerDetails';

const CurrentMonthCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    loadCustomers();
  }, [selectedMonth, selectedYear]);

  const loadCustomers = async () => {
    const allCustomers = await getCustomers();
    
    const filtered = allCustomers.filter(customer => {
      const createdDate = new Date(customer.createdAt);
      return createdDate.getMonth() === selectedMonth && createdDate.getFullYear() === selectedYear;
    });
    
    setCustomers(filtered);
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Current Month Customers</h1>
      
      <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
        <div className="flex gap-4 items-center">
          <label className="text-gray-700 font-semibold">Filter by Month:</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="px-4 py-2 border rounded-lg"
            style={{borderColor: '#1e3a8a'}}
          >
            <option value={0}>January</option>
            <option value={1}>February</option>
            <option value={2}>March</option>
            <option value={3}>April</option>
            <option value={4}>May</option>
            <option value={5}>June</option>
            <option value={6}>July</option>
            <option value={7}>August</option>
            <option value={8}>September</option>
            <option value={9}>October</option>
            <option value={10}>November</option>
            <option value={11}>December</option>
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-4 py-2 border rounded-lg"
            style={{borderColor: '#1e3a8a'}}
          >
            {[...Array(5)].map((_, i) => {
              const year = new Date().getFullYear() - i;
              return <option key={year} value={year}>{year}</option>;
            })}
          </select>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-6">
        <p className="text-gray-600 mb-4">Total: {customers.length} customers this month</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.map((customer) => (
            <div
              key={customer._id}
              onClick={() => setSelectedCustomer(customer)}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md cursor-pointer transition-shadow"
            >
              <h3 className="font-bold text-lg text-gray-800">{customer.name}</h3>
              <p className="text-sm text-gray-600">{customer.phone}</p>
              <p className="text-sm text-gray-500">{customer.area}</p>
              <p className="text-xs text-gray-400 mt-2">
                Added: {new Date(customer.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>

        {customers.length === 0 && (
          <p className="text-center text-gray-500 py-8">No customers added this month</p>
        )}
      </div>

      {selectedCustomer && (
        <CustomerDetails
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          onUpdate={loadCustomers}
        />
      )}
    </div>
  );
};

export default CurrentMonthCustomers;
