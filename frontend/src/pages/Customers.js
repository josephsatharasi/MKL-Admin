import React, { useState, useEffect } from 'react';
import { Trash2, Download, Search, Eye } from 'lucide-react';
import { toast } from 'react-toastify';
import { getCustomers, deleteCustomer, getDaysUntilExpiry } from '../utils/storage';
import { generateReceipt } from '../utils/receipt';
import CustomerDetails from '../components/CustomerDetails';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = () => {
    setCustomers(getCustomers());
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      deleteCustomer(id);
      loadCustomers();
      toast.success(`${name} deleted successfully!`);
    }
  };

  const getStatusBadge = (endDate) => {
    const days = getDaysUntilExpiry(endDate);
    if (days < 0) return <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs">Expired</span>;
    if (days <= 7) return <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-xs">Expiring Soon</span>;
    return <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs">Active</span>;
  };

  const filteredCustomers = customers.filter(c => {
    const days = getDaysUntilExpiry(c.endDate);
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'active' ? days > 7 :
      filter === 'expiring' ? days > 0 && days <= 7 :
      filter === 'expired' ? days < 0 : true;
    
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-teal-700">Customers</h1>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg font-semibold transition-all ${filter === 'all' ? 'bg-teal-600 text-white shadow-lg' : 'bg-white text-teal-700 hover:bg-teal-50 hover:shadow-md'}`}>All</button>
          <button onClick={() => setFilter('active')} className={`px-4 py-2 rounded-lg font-semibold transition-all ${filter === 'active' ? 'bg-teal-600 text-white shadow-lg' : 'bg-white text-teal-700 hover:bg-teal-50 hover:shadow-md'}`}>Active</button>
          <button onClick={() => setFilter('expiring')} className={`px-4 py-2 rounded-lg font-semibold transition-all ${filter === 'expiring' ? 'bg-teal-600 text-white shadow-lg' : 'bg-white text-teal-700 hover:bg-teal-50 hover:shadow-md'}`}>Expiring</button>
          <button onClick={() => setFilter('expired')} className={`px-4 py-2 rounded-lg font-semibold transition-all ${filter === 'expired' ? 'bg-teal-600 text-white shadow-lg' : 'bg-white text-teal-700 hover:bg-teal-50 hover:shadow-md'}`}>Expired</button>
        </div>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name, phone, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-teal-600 to-teal-700 text-white">
              <tr>
                <th className="px-4 md:px-6 py-3 text-left text-sm">Name</th>
                <th className="px-4 md:px-6 py-3 text-left text-sm">Phone</th>
                <th className="px-4 md:px-6 py-3 text-left text-sm hidden md:table-cell">Email</th>
                <th className="px-4 md:px-6 py-3 text-left text-sm hidden lg:table-cell">Partner</th>
                <th className="px-4 md:px-6 py-3 text-left text-sm">Plan</th>
                <th className="px-4 md:px-6 py-3 text-left text-sm hidden lg:table-cell">Start Date</th>
                <th className="px-4 md:px-6 py-3 text-left text-sm">End Date</th>
                <th className="px-4 md:px-6 py-3 text-left text-sm">Status</th>
                <th className="px-4 md:px-6 py-3 text-left text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer, index) => (
                <tr 
                  key={customer.id} 
                  className={`transition-all hover:bg-teal-100 hover:shadow-md cursor-pointer ${index % 2 === 0 ? 'bg-teal-50' : 'bg-white'}`}
                  onClick={() => setSelectedCustomer(customer)}
                >
                  <td className="px-4 md:px-6 py-4 text-sm font-semibold text-teal-700">{customer.name}</td>
                  <td className="px-4 md:px-6 py-4 text-sm">{customer.phone}</td>
                  <td className="px-4 md:px-6 py-4 text-sm hidden md:table-cell">{customer.email}</td>
                  <td className="px-4 md:px-6 py-4 text-sm hidden lg:table-cell">
                    <span className="px-2 py-1 bg-teal-200 text-teal-700 rounded text-xs font-semibold">{customer.partnerName}</span>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-sm">{customer.plan}M</td>
                  <td className="px-4 md:px-6 py-4 text-sm hidden lg:table-cell">{customer.startDate}</td>
                  <td className="px-4 md:px-6 py-4 text-sm">{customer.endDate}</td>
                  <td className="px-4 md:px-6 py-4 text-sm">{getStatusBadge(customer.endDate)}</td>
                  <td className="px-4 md:px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCustomer(customer);
                        }} 
                        className="text-teal-600 hover:text-teal-800 hover:scale-110 transition-transform"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          generateReceipt(customer);
                          toast.success('Receipt downloaded!');
                        }} 
                        className="text-green-600 hover:text-green-800 hover:scale-110 transition-transform"
                        title="Download Receipt"
                      >
                        <Download size={18} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(customer.id, customer.name);
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
        <CustomerDetails customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />
      )}
    </div>
  );
};

export default Customers;
