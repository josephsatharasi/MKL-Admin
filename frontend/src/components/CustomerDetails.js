import React from 'react';
import { X, User, Phone, Mail, MapPin, Package, Calendar } from 'lucide-react';

const CustomerDetails = ({ customer, onClose }) => {
  const serviceDate = customer.serviceDate ? new Date(customer.serviceDate) : new Date();
  const expireDate = new Date(serviceDate);
  expireDate.setMonth(expireDate.getMonth() + parseInt(customer.service || 0));
  const formattedExpireDate = expireDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Customer Profile</h2>
          <button onClick={onClose} className="hover:bg-blue-500 p-2 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Profile Picture at Top Center */}
          <div className="flex justify-center">
            <div className="w-32 h-32 rounded-full border-4 border-blue-500 overflow-hidden bg-gray-100">
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
              <User className="text-blue-600 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-600">Customer Name</p>
                <p className="font-semibold text-blue-900">{customer.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="text-blue-600 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-600">Phone Number</p>
                <p className="font-semibold text-blue-900">{customer.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="text-blue-600 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-blue-900">{customer.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Package className="text-blue-600 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-600">Area</p>
                <p className="font-semibold text-blue-900">{customer.area}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Package className="text-blue-600 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-600">Brand</p>
                <p className="font-semibold text-blue-900">{customer.brand}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Package className="text-blue-600 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-600">Recent Service Date</p>
                <p className="font-semibold text-blue-900">{customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('en-GB') : 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="text-red-600 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-600">Expire Date</p>
                <p className="font-semibold text-red-600">{formattedExpireDate}</p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="text-blue-600 mt-1" size={20} />
            <div>
              <p className="text-sm text-gray-600">Address</p>
              <p className="font-semibold text-blue-900">{customer.address}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-bold text-blue-900 mb-2">Additional Information</h3>
            <div className="text-sm text-gray-600">
              <p>Customer ID: #{customer._id || customer.id}</p>
              <p>Registered: {new Date(customer.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
