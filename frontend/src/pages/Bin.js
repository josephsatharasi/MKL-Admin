import React, { useState, useEffect } from 'react';
import { Trash2, RotateCcw, X } from 'lucide-react';
import Table from '../components/Table';

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
        loadDeletedCustomers();
      }
    } catch (error) {
      console.error('Failed to restore customer');
    }
  };

  const handlePermanentDelete = async (id, name) => {
    try {
      const response = await fetch(`${API_URL}/bin/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        loadDeletedCustomers();
      }
    } catch (error) {
      console.error('Failed to delete customer');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Bin</h1>
        <p className="text-gray-600">Deleted customers - Restore or permanently delete</p>
      </div>

      <Table
        columns={[
          { header: 'Name', field: 'name', bold: true, color: '#1e3a8a' },
          { header: 'Phone', field: 'phone' },
          { header: 'Deleted At', hideOnTablet: true, render: (customer) => new Date(customer.deletedAt).toLocaleDateString() },
          { header: 'Actions', render: (customer) => (
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
          )}
        ]}
        data={deletedCustomers}
        emptyMessage="Bin is empty"
      />
    </div>
  );
};

export default Bin;
