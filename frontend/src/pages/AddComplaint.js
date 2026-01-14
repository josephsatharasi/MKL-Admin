import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FileText, AlertCircle, CheckCircle } from 'lucide-react';

const AddComplaint = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerName: '',
    subject: '',
    body: ''
  });
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [customerExists, setCustomerExists] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadCustomers = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/customers`);
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error('Failed to load customers');
    }
  };

  const handleCustomerNameChange = (value) => {
    setFormData({...formData, customerName: value});
    
    if (value.trim() === '') {
      setFilteredCustomers([]);
      setShowDropdown(false);
      setCustomerExists(null);
      return;
    }

    const matches = customers.filter(c => 
      c.name.toLowerCase().includes(value.toLowerCase())
    );
    
    setFilteredCustomers(matches);
    setShowDropdown(matches.length > 0);
    
    const exactMatch = customers.some(c => 
      c.name.toLowerCase().trim() === value.toLowerCase().trim()
    );
    setCustomerExists(exactMatch);
  };

  const selectCustomer = (name) => {
    setFormData({...formData, customerName: name});
    setShowDropdown(false);
    setCustomerExists(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Recheck customer exists before submit
    const isValid = customers.some(c => 
      c.name.toLowerCase().trim() === formData.customerName.toLowerCase().trim()
    );
    
    if (!isValid) {
      toast.error('Please select a valid customer from the list');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/complaints`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit complaint');
      }

      toast.success('Complaint submitted successfully!');
      navigate('/admin/complaints');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Submit Complaint</h1>
      
      <div className="rounded-xl shadow-lg p-6 bg-white max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative" ref={dropdownRef}>
            <label className="block text-sm font-semibold mb-2" style={{color: '#1e3a8a'}}>
              Customer Name *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.customerName}
                onChange={(e) => handleCustomerNameChange(e.target.value)}
                onFocus={() => formData.customerName && filteredCustomers.length > 0 && setShowDropdown(true)}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                  customerExists === false ? 'border-red-500' : 
                  customerExists === true ? 'border-green-500' : 'border-gray-300'
                }`}
                placeholder="Start typing customer name..."
                autoComplete="off"
              />
              {customerExists === true && (
                <CheckCircle className="absolute right-3 top-3.5 text-green-500" size={20} />
              )}
              {customerExists === false && (
                <AlertCircle className="absolute right-3 top-3.5 text-red-500" size={20} />
              )}
            </div>
            
            {showDropdown && filteredCustomers.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border-2 border-blue-900 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredCustomers.map((customer) => (
                  <div
                    key={customer._id}
                    onClick={() => selectCustomer(customer.name)}
                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 transition-colors"
                  >
                    <div className="font-semibold" style={{color: '#1e3a8a'}}>{customer.name}</div>
                    <div className="text-xs text-gray-600">{customer.phone} • {customer.area}</div>
                  </div>
                ))}
              </div>
            )}
            
            {customerExists === false && formData.customerName.trim() !== '' && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle size={14} />
                Customer does not exist in the system
              </p>
            )}
            {customerExists === true && (
              <p className="text-green-500 text-sm mt-1 flex items-center gap-1">
                <CheckCircle size={14} />
                Customer verified
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{color: '#1e3a8a'}}>
              Subject *
            </label>
            <input
              type="text"
              required
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
              placeholder="Enter complaint subject"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{color: '#1e3a8a'}}>
              Complaint Details *
            </label>
            <textarea
              required
              rows="6"
              value={formData.body}
              onChange={(e) => setFormData({...formData, body: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
              placeholder="Describe the complaint in detail..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 text-white rounded-lg font-semibold shadow-md hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{background: '#1e3a8a'}}
            >
              <FileText size={20} />
              {loading ? 'Submitting...' : 'Submit Complaint'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/complaints')}
              className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddComplaint;
