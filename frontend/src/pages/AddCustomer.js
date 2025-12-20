import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { addCustomer, calculateEndDate } from '../utils/storage';
import { generateReceipt } from '../utils/receipt';
import { getPartners, calculatePrice } from '../utils/partners';

const AddCustomer = () => {
  const navigate = useNavigate();
  const [partners, setPartners] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    plan: '3',
    startDate: new Date().toISOString().split('T')[0],
    partnerId: '',
    partnerName: '',
    amount: 0,
  });

  useEffect(() => {
    const loadedPartners = getPartners();
    setPartners(loadedPartners);
    if (loadedPartners.length > 0) {
      setFormData(prev => ({
        ...prev,
        partnerId: loadedPartners[0].id,
        partnerName: loadedPartners[0].name,
        amount: loadedPartners[0].price3Months,
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      const numericValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: numericValue }));
      return;
    }
    
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      
      if (name === 'partnerId') {
        const partner = partners.find(p => p.id === parseInt(value));
        if (partner) {
          updated.partnerName = partner.name;
          updated.amount = calculatePrice(partner.price3Months, updated.plan);
        }
      }
      
      if (name === 'plan') {
        const partner = partners.find(p => p.id === parseInt(updated.partnerId));
        if (partner) {
          updated.amount = calculatePrice(partner.price3Months, value);
        }
      }
      
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.phone.length !== 10) {
      toast.error('Phone number must be exactly 10 digits!');
      return;
    }
    
    const endDate = calculateEndDate(formData.startDate, formData.plan);
    const customer = { ...formData, endDate };
    const newCustomer = addCustomer(customer);
    generateReceipt(newCustomer);
    toast.success(`${newCustomer.name} added successfully! Receipt downloaded.`);
    setTimeout(() => navigate('/admin/customers'), 1500);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-teal-700 mb-6">Add New Customer</h1>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-4 md:p-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-teal-700 mb-2">Customer Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border-2 border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            placeholder="Enter customer name"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-teal-700 mb-2">Phone Number *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            maxLength="10"
            pattern="[0-9]{10}"
            className="w-full px-4 py-2 border-2 border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            placeholder="9876543210"
          />
          <p className="text-xs text-gray-500 mt-1">Enter 10 digit mobile number (numbers only)</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-teal-700 mb-2">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border-2 border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            placeholder="customer@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-teal-700 mb-2">Address *</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            rows="3"
            className="w-full px-4 py-2 border-2 border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            placeholder="Enter complete address"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-teal-700 mb-2">Select Partner *</label>
          <select
            name="partnerId"
            value={formData.partnerId}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border-2 border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            {partners.map(partner => (
              <option key={partner.id} value={partner.id}>
                {partner.name} - ₹{partner.price3Months}/3 months
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-teal-700 mb-2">Rental Plan *</label>
          <select
            name="plan"
            value={formData.plan}
            onChange={handleChange}
            className="w-full px-4 py-2 border-2 border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="3">3 Months</option>
            <option value="6">6 Months</option>
            <option value="12">12 Months (1 Year)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-teal-700 mb-2">Start Date *</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border-2 border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-4 rounded-lg border-2 border-teal-300">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-teal-700 font-semibold">End Date:</p>
              <p className="text-lg font-bold text-teal-700">{calculateEndDate(formData.startDate, formData.plan)}</p>
            </div>
            <div>
              <p className="text-sm text-teal-700 font-semibold">Total Amount:</p>
              <p className="text-2xl font-bold text-green-600">₹{formData.amount}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-teal-700 text-white py-3 rounded-lg hover:from-teal-700 hover:to-teal-800 transition-colors font-semibold shadow-md"
          >
            <Save size={20} />
            Add Customer & Download Receipt
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/customers')}
            className="flex items-center justify-center gap-2 px-6 bg-gray-300 text-teal-700 py-3 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
          >
            <X size={20} />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCustomer;
