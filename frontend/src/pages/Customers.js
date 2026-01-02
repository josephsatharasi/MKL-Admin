import React, { useState, useEffect } from 'react';
import { Trash2, Search, Eye } from 'lucide-react';
import { toast } from 'react-toastify';
import { getCustomers, deleteCustomer } from '../utils/storage';
import CustomerDetails from '../components/CustomerDetails';
import ConfirmModal from '../components/ConfirmModal';
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
    toast.success(`${customerToDelete.name} deleted successfully!`);
  };


  const filteredCustomers = customers.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
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
            placeholder="Search by name, phone, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border-2 border-primary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
          />
        </div>
      </div>

      <div className="rounded-xl shadow-lg overflow-hidden bg-white">
        <div className="overflow-x-auto overflow-y-auto" style={{maxHeight: '500px'}}>
          <table className="w-full">
            <thead className="text-white sticky top-0 z-10" style={{background: '#1e3a8a'}}>
              <tr>
                <th className="px-4 md:px-6 py-3 text-left text-sm">Name</th>
                <th className="px-4 md:px-6 py-3 text-left text-sm">Phone</th>
                <th className="px-4 md:px-6 py-3 text-left text-sm hidden md:table-cell">Email</th>
                <th className="px-4 md:px-6 py-3 text-left text-sm hidden lg:table-cell">Area</th>
                <th className="px-4 md:px-6 py-3 text-left text-sm hidden lg:table-cell">Brand</th>
                <th className="px-4 md:px-6 py-3 text-left text-sm">Next Remainder</th>
                <th className="px-4 md:px-6 py-3 text-left text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer, index) => (
                <tr 
                  key={customer.id} 
                  className="cursor-pointer"
                  style={{backgroundColor: index % 2 !== 0 ? '#1e3a8a1A' : 'white'}}
                  onClick={() => setSelectedCustomer(customer)}
                >
                  <td className="px-4 md:px-6 py-4 text-sm font-semibold" style={{color: '#1e3a8a'}}>{customer.name}</td>
                  <td className="px-4 md:px-6 py-4 text-sm">{customer.phone}</td>
                  <td className="px-4 md:px-6 py-4 text-sm hidden md:table-cell">{customer.email}</td>
                  <td className="px-4 md:px-6 py-4 text-sm hidden lg:table-cell">
                    <span className="px-2 py-1 rounded text-xs font-semibold" style={{backgroundColor: '#1e3a8a' + '33', color: '#1e3a8a'}}>{customer.area}</span>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-sm hidden lg:table-cell">{customer.brand}</td>
                  <td className="px-4 md:px-6 py-4 text-sm">{customer.service}M</td>
                  <td className="px-4 md:px-6 py-4 text-sm">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredCustomers.length === 0 && (
          <div className="text-center py-8 text-gray-500">No customers found</div>
        )}
      </div>

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
