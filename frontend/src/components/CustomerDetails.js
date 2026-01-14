import React, { useState } from 'react';
import { X, User, Phone, Mail, MapPin, Package, Calendar, Edit2 } from 'lucide-react';
import { updateCustomer } from '../utils/storage';
import { toast } from 'react-toastify';

const CustomerDetails = ({ customer, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPicsModal, setShowPicsModal] = useState(false);
  console.log('Customer data:', customer);
  console.log('Additional pics:', customer.additionalPics);
  const [formData, setFormData] = useState({
    name: customer.name || '',
    phone: customer.phone || '',
    email: customer.email || '',
    address: customer.address || '',
    area: customer.area || '',
    brand: customer.brand || '',
    service: customer.service || ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await updateCustomer(customer._id || customer.id, formData);
      toast.success('Customer updated successfully!');
      setIsEditing(false);
      if (onUpdate) onUpdate();
      onClose();
    } catch (error) {
      toast.error('Failed to update customer');
    }
  };

  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const [year, month, day] = dateStr.split('-');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  };

  const serviceDate = customer.serviceDate 
    ? parseDate(customer.serviceDate) 
    : (customer.createdAt ? new Date(customer.createdAt) : new Date());
  const expireDate = new Date(serviceDate);
  expireDate.setMonth(expireDate.getMonth() + parseInt(customer.service || 0));
  const formattedExpireDate = expireDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="text-white p-6 flex justify-between items-center" style={{background: '#1e3a8a'}}>
          <h2 className="text-2xl font-bold">{isEditing ? 'Edit Customer' : 'Customer Profile'}</h2>
          <div className="flex gap-2">
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="p-2 rounded-lg transition-colors" style={{backgroundColor: 'rgba(62, 164, 240, 0.2)'}} title="Edit Customer">
                <Edit2 size={24} />
              </button>
            )}
            <button onClick={onClose} className="p-2 rounded-lg transition-colors" style={{backgroundColor: 'rgba(62, 164, 240, 0.2)'}}>
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex justify-center">
            <div className="w-32 h-32 rounded-full border-4 overflow-hidden bg-gray-100" style={{borderColor: '#1e3a8a'}}>
              {customer.profilePic ? (
                <img src={customer.profilePic} alt={customer.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User size={60} className="text-gray-400" />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <User className="mt-1" style={{color: '#1e3a8a'}} size={20} />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Customer Name</p>
                {isEditing ? (
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-2 py-1 border rounded" />
                ) : (
                  <p className="font-semibold text-blue-900">{customer.name}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="mt-1" style={{color: '#1e3a8a'}} size={20} />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Phone Number</p>
                {isEditing ? (
                  <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-2 py-1 border rounded" />
                ) : (
                  <p className="font-semibold text-blue-900">{customer.phone}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="mt-1" style={{color: '#1e3a8a'}} size={20} />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Email</p>
                {isEditing ? (
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-2 py-1 border rounded" />
                ) : (
                  <p className="font-semibold text-blue-900">{customer.email}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Package className="mt-1" style={{color: '#1e3a8a'}} size={20} />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Area</p>
                {isEditing ? (
                  <input type="text" name="area" value={formData.area} onChange={handleInputChange} className="w-full px-2 py-1 border rounded" />
                ) : (
                  <p className="font-semibold text-blue-900">{customer.area}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Package className="mt-1" style={{color: '#1e3a8a'}} size={20} />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Brand</p>
                {isEditing ? (
                  <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} className="w-full px-2 py-1 border rounded" />
                ) : (
                  <p className="font-semibold text-blue-900">{customer.brand}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Package className="mt-1" style={{color: '#1e3a8a'}} size={20} />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Service (Months)</p>
                {isEditing ? (
                  <input type="number" name="service" value={formData.service} onChange={handleInputChange} className="w-full px-2 py-1 border rounded" />
                ) : (
                  <p className="font-semibold text-blue-900">{customer.service}M</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Package className="mt-1" style={{color: '#1e3a8a'}} size={20} />
              <div>
                <p className="text-sm text-gray-600">Customer Registered</p>
                <p className="font-semibold text-blue-900">
                  {customer.serviceDate 
                    ? (() => {
                        const [year, month, day] = customer.serviceDate.split('-');
                        return `${day}/${month}/${year}`;
                      })()
                    : (customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="text-red-600 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-600">Expire Date</p>
                <p className="font-semibold text-red-600">{formattedExpireDate}</p>
              </div>
            </div>

            {customer.additionalPics && customer.additionalPics.length > 0 && (
              <div className="flex items-start gap-3">
                <Package className="mt-1" style={{color: '#1e3a8a'}} size={20} />
                <div>
                  <p className="text-sm text-gray-600">Additional Pictures</p>
                  <button
                    onClick={() => setShowPicsModal(true)}
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    View Pictures ({customer.additionalPics.length})
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="mt-1" style={{color: '#1e3a8a'}} size={20} />
            <div className="flex-1">
              <p className="text-sm text-gray-600">Address</p>
              {isEditing ? (
                <textarea name="address" value={formData.address} onChange={handleInputChange} className="w-full px-2 py-1 border rounded" rows="2" />
              ) : (
                <p className="font-semibold text-blue-900">{customer.address}</p>
              )}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-bold text-blue-900 mb-2">Additional Information</h3>
            <div className="text-sm text-gray-600">
              <p>Customer ID: #{customer._id || customer.id}</p>
              <p>Registered: {new Date(customer.createdAt).toLocaleDateString()}</p>
              {customer.additionalPics && customer.additionalPics.length > 0 && (
                <button
                  onClick={() => setShowPicsModal(true)}
                  className="mt-2 text-blue-600 hover:underline font-semibold"
                >
                  View Photos ({customer.additionalPics.length})
                </button>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-3 justify-end">
              <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} className="px-4 py-2 text-white rounded-lg transition-colors" style={{background: '#1e3a8a'}}>
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {showPicsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4" onClick={() => setShowPicsModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="text-white p-4 md:p-6 flex justify-between items-center" style={{background: '#1e3a8a'}}>
              <h2 className="text-xl md:text-2xl font-bold">Additional Pictures</h2>
              <button onClick={() => setShowPicsModal(false)} className="p-2 rounded-lg transition-colors" style={{backgroundColor: 'rgba(62, 164, 240, 0.2)'}}>
                <X size={24} />
              </button>
            </div>
            <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {customer.additionalPics.map((pic, idx) => (
                <img key={idx} src={pic} alt={`Additional ${idx + 1}`} className="w-full h-48 object-contain rounded border-2 border-blue-200 bg-gray-50" />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDetails;
