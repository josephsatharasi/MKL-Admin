import React, { useState, useEffect } from 'react';
import { Trash2, Search, Eye } from 'lucide-react';
import { getCustomers, deleteCustomer } from '../utils/storage';
import CustomerDetails from '../components/CustomerDetails';
import ConfirmModal from '../components/ConfirmModal';
import Table from '../components/Table';
import { useSearchParams } from 'react-router-dom';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    const data = await getCustomers();
    setCustomers(data);
  };

  const handleDelete = async () => {
    await deleteCustomer(customerToDelete.id);
    loadCustomers();
  };


  const filteredCustomers = customers.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm);
    
    if (searchParams.get('filter') === 'expired') {
      const parseDate = (dateStr) => {
        if (!dateStr) return null;
        const [year, month, day] = dateStr.split('-');
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      };
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const serviceDate = c.serviceDate ? parseDate(c.serviceDate) : new Date(c.createdAt);
      const expireDate = new Date(serviceDate);
      expireDate.setMonth(expireDate.getMonth() + parseInt(c.service || 0));
      expireDate.setHours(0, 0, 0, 0);
      
      const isExpired = expireDate < today;
      return matchesSearch && isExpired;
    }
    
    return matchesSearch;
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">All Customers</h1>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-primary" size={20} />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border-2 border-primary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
          />
        </div>
      </div>

      <Table
        columns={[
          { header: 'Name', field: 'name', bold: true, color: '#1e3a8a' },
          { header: 'Phone', field: 'phone' },
          { header: 'Area', hideOnTablet: true, render: (customer) => (
            <span className="px-2 py-1 rounded text-xs font-semibold" style={{backgroundColor: '#1e3a8a33', color: '#1e3a8a'}}>{customer.area}</span>
          )},
          { header: 'Brand', field: 'brand', hideOnTablet: true },
          { header: 'Next Remainder', render: (customer) => `${customer.service}M` },
          { header: 'Actions', stopPropagation: true, render: (customer) => (
            <div className="flex gap-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCustomer(customer);
                }} 
                className="hover:scale-110 transition-transform"
                style={{color: '#1e3a8a'}}
                title="View Details"
              >
                <Eye size={18} />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setCustomerToDelete({ id: customer._id || customer.id, name: customer.name });
                }} 
                className="text-red-500 hover:text-red-700 hover:scale-110 transition-transform"
                title="Delete Customer"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}
        ]}
        data={filteredCustomers}
        onRowClick={setSelectedCustomer}
        emptyMessage="No customers found"
      />

      {selectedCustomer && (
        <CustomerDetails customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} onUpdate={loadCustomers} />
      )}

      <ConfirmModal
        isOpen={!!customerToDelete}
        onClose={() => setCustomerToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Customer"
        message={`Are you sure you want to delete ${customerToDelete?.name}? This action cannot be undone.`}
      />
    </div>
  );
};

export default Customers;
