import React, { useState, useEffect } from 'react';
import { Trash2, RotateCcw, X } from 'lucide-react';
import { toast } from 'react-toastify';

const API_URL = 'https://mkl-admin-backend.onrender.com/api';

const Bin = () => {
  const [deletedCustomers, setDeletedCustomers] = useState([]);

  useEffect(() => {
    loadDeletedCustomers();
  }, []);

  const loadDeletedCustomers = async () => {
    try {
      const response = await fetch(`${API_URL}/bin`);
      const data = await response.json();
      setDeletedCustomers(data);
    } catch (error) {
      console.error('Error loading deleted customers:', error);
    }
  };

  const handleRestore = async (id, name) => {
    try {
      const response = await fetch(`${API_URL}/bin/restore/${id}`, {
        method: 'POST',
      });
      if (response.ok) {
        toast.success(`${name} restored successfully!`);
        loadDeletedCustomers();
      }
    } catch (error) {
      toast.error('Failed to restore customer');
    }
  };

  const handlePermanentDelete = async (id, name) => {
    try {
      const response = await fetch(`${API_URL}/bin/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        toast.success(`${name} permanently deleted`);
        loadDeletedCustomers();
      }
    } catch (error) {
      toast.error('Failed to delete customer');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Bin</h1>
        <p className="text-gray-600">Deleted customers - Restore or permanently delete</p>
      </div>

      <div className="rounded-xl shadow-lg overflow-hidden bg-white mb-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead className="text-white sticky top-0 z-10" style={{background: '#1e3a8a'}}>
              <tr>
                <th className="px-4 md:px-6 py-3 text-left text-sm">Name</th>
                <th className="px-4 md:px-6 py-3 text-left text-sm">Phone</th>
                <th className="px-4 md:px-6 py-3 text-left text-sm hidden md:table-cell">Email</th>
                <th className="px-4 md:px-6 py-3 text-left text-sm hidden lg:table-cell">Deleted At</th>
                <th className="px-4 md:px-6 py-3 text-left text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {deletedCustomers.map((customer, index) => (
                <tr 
                  key={customer._id} 
                  className="cursor-pointer" style={{backgroundColor: index % 2 === 0 ? 'white' : '#1e3a8a1A'}}
                >
                  <td className="px-4 md:px-6 py-4 text-sm font-semibold" style={{color: '#1e3a8a'}}>{customer.name}</td>
                  <td className="px-4 md:px-6 py-4 text-sm">{customer.phone}</td>
                  <td className="px-4 md:px-6 py-4 text-sm hidden md:table-cell">{customer.email}</td>
                  <td className="px-4 md:px-6 py-4 text-sm hidden lg:table-cell">
                    {new Date(customer.deletedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 md:px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleRestore(customer._id, customer.name)}
                        className="text-green-600 hover:text-green-800 hover:scale-110 transition-transform"
                        title="Restore"
                      >
                        <RotateCcw size={18} />
                      </button>
                      <button 
                        onClick={() => handlePermanentDelete(customer._id, customer.name)}
                        className="text-red-500 hover:text-red-700 hover:scale-110 transition-transform"
                        title="Permanently Delete"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {deletedCustomers.length === 0 && (
          <div className="text-center py-8 text-gray-500">Bin is empty</div>
        )}
      </div>
    </div>
  );
};

export default Bin;
