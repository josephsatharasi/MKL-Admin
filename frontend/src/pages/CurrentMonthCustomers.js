import React, { useState, useEffect } from 'react';
import { getCustomers } from '../utils/storage';
import { X, Plus, Edit2, Trash2 } from 'lucide-react';
import Table from '../components/Table';

const CurrentMonthCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [services, setServices] = useState([]);
  const [yearFilter, setYearFilter] = useState('');
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    loadCustomers();
  }, [selectedMonth, selectedYear]);

  const loadCustomers = async () => {
    try {
      // Use optimized API to get customer IDs with services in selected month
      const response = await fetch(`${API_URL}/services/stats/monthly-customers?month=${selectedMonth}&year=${selectedYear}`);
      const data = await response.json();
      
      if (data.customerIds && data.customerIds.length > 0) {
        // Get full customer details
        const allCustomers = await getCustomers();
        const filtered = allCustomers.filter(customer => 
          data.customerIds.includes(customer._id)
        );
        setCustomers(filtered);
      } else {
        setCustomers([]);
      }
    } catch (error) {
      console.error('Error loading customers:', error);
      setCustomers([]);
    }
  };

  const handleRowClick = async (customer) => {
    setSelectedCustomer(customer);
    setYearFilter('');
    await loadServices(customer._id);
  };

  const loadServices = async (customerId) => {
    try {
      const response = await fetch(`${API_URL}/services/customer/${customerId}`);
      const data = await response.json();
      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading services:', error);
      setServices([]);
    }
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Current Month Service Customers</h1>
      
      <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
        <div className="flex gap-4 items-center flex-wrap">
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
        <p className="text-gray-600 mb-4">Total: {customers.length} customers with services this month</p>
        
      <Table
        columns={[
          { header: 'Name', field: 'name', bold: true, color: '#1e3a8a' },
          { header: 'Phone', field: 'phone' },
          { header: 'Area', field: 'area' }
        ]}
        data={customers}
        onRowClick={handleRowClick}
        emptyMessage="No services done this month"
      />
      </div>

      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedCustomer(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="text-white p-6 flex justify-between items-center" style={{background: '#1e3a8a'}}>
              <h2 className="text-2xl font-bold">Service History - {selectedCustomer.name}</h2>
              <button onClick={() => setSelectedCustomer(null)} className="hover:bg-blue-500 p-2 rounded-lg transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-3">
                  <h3 className="font-bold text-blue-900">All Services</h3>
                  <select
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                    className="px-3 py-2 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">All Years</option>
                    {Array.isArray(services) && services.length > 0 && [...new Set(services.map(s => new Date(s.serviceDate).getFullYear()))]
                      .sort((a, b) => b - a)
                      .map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                  </select>
                </div>
                {Array.isArray(services) && services.filter(s => !yearFilter || new Date(s.serviceDate).getFullYear().toString() === yearFilter).length > 0 ? (
                  <div className="space-y-2">
                    {services
                      .filter(s => !yearFilter || new Date(s.serviceDate).getFullYear().toString() === yearFilter)
                      .map((service) => (
                      <div
                        key={service._id}
                        className="p-3 bg-white rounded-lg border border-blue-200"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-semibold text-blue-900">Service Date: {new Date(service.serviceDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                            <p className="text-sm text-gray-600 mt-1">Total: ₹{service.totalBill} | Payment: {service.paymentMode}</p>
                            <div className="mt-2">
                              <p className="text-sm font-semibold text-gray-700">Spare Parts Used:</p>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {Object.entries(service.spareParts).map(([part, used]) => (
                                  used && <span key={part} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">✓ {part}</span>
                                ))}
                              </div>
                            </div>
                            {service.images && service.images.length > 0 && (
                              <p className="text-xs text-gray-500 mt-2">📷 {service.images.length} image(s) attached</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">{yearFilter ? `No services found for ${yearFilter}` : 'No service history'}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentMonthCustomers;
