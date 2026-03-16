import React, { useState, useEffect } from 'react';
import { getCustomers } from '../utils/storage';
import CustomerDetails from '../components/CustomerDetails';
import Table from '../components/Table';

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
        
      <Table
        columns={[
          { header: 'Name', field: 'name', bold: true, color: '#1e3a8a' },
          { header: 'Phone', field: 'phone' },
          { header: 'Area', field: 'area' },
          { header: 'Added', render: (customer) => new Date(customer.createdAt).toLocaleDateString() }
        ]}
        data={customers}
        onRowClick={setSelectedCustomer}
        emptyMessage="No customers added this month"
      />
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
