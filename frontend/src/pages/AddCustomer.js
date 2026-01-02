import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, Download, Upload, User, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';
import { addCustomer } from '../utils/storage';
import jsPDF from 'jspdf';

const AddCustomer = () => {
  const navigate = useNavigate();
  const [savedCustomer, setSavedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    area: '',
    service: '',
    brand: '',
  });

  useEffect(() => {}, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      const numericValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: numericValue }));
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        toast.error('File size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.phone.length !== 10) {
      toast.error('Phone number must be exactly 10 digits!');
      return;
    }
    
    try {
      const datePart = selectedDate.includes('T') ? selectedDate.split('T')[0] : selectedDate;
      console.log('Selected Date:', selectedDate);
      console.log('Date Part to save:', datePart);
      const customerData = { ...formData, profilePic, serviceDate: datePart };
      const newCustomer = await addCustomer(customerData);
      console.log('Saved customer serviceDate:', newCustomer.serviceDate);
      setSavedCustomer({ ...newCustomer, profilePic, serviceDate: datePart });
      toast.success(`${newCustomer.name} added successfully!`);
    } catch (error) {
      toast.error(error.message || 'Failed to add customer');
    }
  };

  const generateInvoice = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Header - Dark Blue Background
    doc.setFillColor(30, 58, 138);
    doc.rect(0, 0, pageWidth, 50, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont(undefined, 'bold');
    doc.text('MKL ENTERPRISES', pageWidth / 2, 15, { align: 'center' });
    
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.text('Sales & Service', pageWidth / 2, 23, { align: 'center' });
    
    doc.setFontSize(8);
    doc.text('Address: D, 58-1-319, NAD Kotha Rd, opp. Bank of India, Nad Junction,', pageWidth / 2, 31, { align: 'center' });
    doc.text('Buchirajupalem, Dungalavanipalem, Visakhapatnam, Andhra Pradesh 530027', pageWidth / 2, 37, { align: 'center' });
    doc.text('Contact: 8179019929', pageWidth / 2, 44, { align: 'center' });
    
    // Title
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('SERVICE RECEIPT', pageWidth / 2, 63, { align: 'center' });
    
    // Receipt ID and Date
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(20, 70, pageWidth - 20, 70);
    
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    const receiptId = `#${Date.now().toString().slice(-4)}`;
    const invoiceDate = new Date(selectedDate);
    const formattedDate = invoiceDate.toLocaleDateString('en-GB').replace(/\//g, '/');
    doc.text(`Receipt ID: ${receiptId}`, 20, 78);
    doc.text(`Date: ${formattedDate}`, pageWidth - 20, 78, { align: 'right' });
    
    // Customer Details Section
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text('CUSTOMER DETAILS:', 20, 93);
    
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.text(`Name: ${savedCustomer.name}`, 20, 103);
    doc.text(`Phone: +91 ${savedCustomer.phone}`, 20, 111);
    doc.text(`Email: ${savedCustomer.email}`, 20, 119);
    
    // Address with larger font
    const addressLines = doc.splitTextToSize(`Address: ${savedCustomer.address}`, pageWidth - 40);
    let addressY = 127;
    addressLines.forEach(line => {
      doc.text(line, 20, addressY);
      addressY += 7;
    });
    
    // Service Details Section
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text('SERVICE DETAILS:', 20, addressY + 8);
    
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.text(`Partner: ${savedCustomer.brand}`, 20, addressY + 18);
    doc.text(`Plan Duration: ${savedCustomer.service} Months`, 20, addressY + 26);
    
    const startDate = new Date(selectedDate);
    const endDate = new Date(selectedDate);
    endDate.setMonth(endDate.getMonth() + parseInt(savedCustomer.service));
    
    doc.text(`Start Date: ${startDate.toLocaleDateString('en-GB').replace(/\//g, '-')}`, 20, addressY + 34);
    doc.text(`End Date: ${endDate.toLocaleDateString('en-GB').replace(/\//g, '-')}`, 20, addressY + 42);
    
    // Payment Details Section
    doc.setFillColor(240, 240, 240);
    doc.rect(20, addressY + 53, pageWidth - 40, 25, 'F');
    
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text('PAYMENT DETAILS:', 25, addressY + 63);
    
    doc.setFontSize(10);
    doc.setTextColor(0, 128, 0);
    doc.setFont(undefined, 'bold');
    doc.text('Amount Paid: Service Activated', 25, addressY + 72);
    
    // Terms & Conditions
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.setFont(undefined, 'italic');
    doc.text('Terms & Conditions:', 20, addressY + 93);
    
    doc.setFont(undefined, 'normal');
    doc.setFontSize(8);
    doc.text('1. Regular maintenance included as per plan', 20, addressY + 101);
    doc.text('2. Customer must notify 7 days before plan expiry for renewal', 20, addressY + 108);
    doc.text('3. Installation charges may apply for new connections', 20, addressY + 115);
    
    // Footer Line
    doc.setLineWidth(0.5);
    doc.line(20, 260, pageWidth - 20, 260);
    
    // Footer
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.text('Thank you for choosing MKL Enterprises!', pageWidth / 2, 270, { align: 'center' });
    doc.setFontSize(8);
    doc.text('For support: Contact 8179019929', pageWidth / 2, 277, { align: 'center' });
    
    doc.save(`Service_Invoice_${savedCustomer.name}_${Date.now()}.pdf`);
    toast.success('Invoice downloaded!');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Add New Customer</h1>
      
      <form onSubmit={handleSubmit} className="rounded-xl shadow-lg p-4 md:p-6 space-y-4 bg-white border border-gray-200">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Profile Picture</label>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full border-2 border-blue-200 flex items-center justify-center overflow-hidden bg-gray-50">
              {profilePic ? (
                <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={32} className="text-gray-400" />
              )}
            </div>
            <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
              <Upload size={18} />
              Upload Photo
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Customer Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter customer name"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Phone Number <span className="text-red-500">*</span></label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            maxLength="10"
            pattern="[0-9]{10}"
            className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="9876543210"
          />
          <p className="text-xs text-gray-500 mt-1">Enter 10 digit mobile number (numbers only)</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="customer@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Address <span className="text-red-500">*</span></label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            rows="3"
            className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter complete address"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Area <span className="text-red-500">*</span></label>
          <select
            name="area"
            value={formData.area}
            onChange={handleChange}
            required
            size="1"
            className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-auto"
          >
            <option value="">Select Area</option>
            <option value="Pendurthi">Pendurthi</option>
            <option value="Kothavalasa">Kothavalasa</option>
            <option value="Anakapelly">Anakapelly</option>
            <option value="Chinna Musaliwada">Chinna Musaliwada</option>
            <option value="NAD Junction">NAD Junction</option>
            <option value="Marripalem">Marripalem</option>
            <option value="Gajuwaka">Gajuwaka</option>
            <option value="Koramanapalem">Koramanapalem</option>
            <option value="Duvvada">Duvvada</option>
            <option value="Kancherapalem">Kancherapalem</option>
            <option value="RTC Complex">RTC Complex</option>
            <option value="Madhurapalem">Madhurapalem</option>
            <option value="Madhuruwada">Madhuruwada</option>
            <option value="Endada">Endada</option>
            <option value="Anumanthwada">Anumanthwada</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Next Reminder <span className="text-red-500">*</span></label>
          <select
            name="service"
            value={formData.service}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Next Reminder</option>
            <option value="3">3 Months</option>
            <option value="6">6 Months</option>
            <option value="12">12 Months</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Purifier Brand <span className="text-red-500">*</span></label>
          <select
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Brand</option>
            <option value="Prolife">Prolife</option>
            <option value="Kent">Kent</option>
            <option value="Merlin">Merlin</option>
            <option value="Softner">Softner</option>
            <option value="IRO-plant">IRO-plant</option>
            <option value="Bpure">Bpure</option>
            <option value="Aquaguard">Aquaguard</option>
            <option value="Local">Local</option>
            <option value="Flipkart">Flipkart</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Service Date & Time <span className="text-red-500">*</span></label>
          <div className="relative">
            <input
              type="date"
              value={selectedDate.split('T')[0]}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
              className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Calendar className="absolute right-3 top-3 text-blue-400 pointer-events-none" size={20} />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {savedCustomer ? (
            <>
              <button
                type="button"
                onClick={generateInvoice}
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-md"
              >
                <Download size={20} />
                Download Invoice
              </button>
              <button
                type="button"
                onClick={() => {
                  setSavedCustomer(null);
                  setFormData({
                    name: '',
                    phone: '',
                    email: '',
                    address: '',
                    area: '',
                    service: '',
                    brand: '',
                  });
                  setProfilePic(null);
                  setSelectedDate(new Date().toISOString().slice(0, 10));
                }}
                className="flex items-center justify-center gap-2 px-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Add Another
              </button>
            </>
          ) : (
            <>
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md"
              >
                <Save size={20} />
                Save
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/customers')}
                className="flex items-center justify-center gap-2 px-6 bg-gray-300 text-blue-700 py-3 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
              >
                <X size={20} />
                Cancel
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddCustomer;
