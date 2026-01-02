import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';

const CustomInvoice = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    brand: '',
    amount: '',
    paymentMode: 'Cash',
    notes: '',
    spareParts: {
      'Sediment': false,
      'Carbon': false,
      'Tap': false,
      'Post/Carbon': false,
      'Membrane': false,
      'Membrane Housing': false,
      'SV': false,
      'Pump': false,
      'SMPS': false,
      'Float': false,
      'Diveter Wall': false,
      'Pipe': false
    },
    images: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const numericValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: numericValue }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (part) => {
    setFormData(prev => ({
      ...prev,
      spareParts: { ...prev.spareParts, [part]: !prev.spareParts[part] }
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({ ...prev, images: [...prev.images, ...imageUrls] }));
  };

  const generateInvoice = () => {
    if (!formData.name || !formData.phone || !formData.brand) {
      toast.error('Please fill required fields!');
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Header
    doc.setFillColor(30, 58, 138);
    doc.rect(0, 0, pageWidth, 50, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(26);
    doc.setFont(undefined, 'bold');
    doc.text('MKL ENTERPRISES', pageWidth / 2, 15, { align: 'center' });
    
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.text('Sales & Service', pageWidth / 2, 24, { align: 'center' });
    
    doc.setFontSize(8);
    doc.text('Address: D, 58-1-319, NAD Kotha Rd, opp. Bank of India, Nad Junction, Buchirajupalem, Dungalavanipalem, Visakhapatnam, AP 530027', pageWidth / 2, 33, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Contact: 8179019929', pageWidth / 2, 43, { align: 'center' });
    
    // Title
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('CUSTOM INVOICE', pageWidth / 2, 63, { align: 'center' });
    
    // Receipt ID and Date
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(20, 70, pageWidth - 20, 70);
    
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    const receiptId = `#${Date.now().toString().slice(-4)}`;
    const currentDate = new Date().toLocaleDateString('en-GB').replace(/\//g, '/');
    doc.text(`Invoice ID: ${receiptId}`, 20, 78);
    doc.text(`Date: ${currentDate}`, pageWidth - 20, 78, { align: 'right' });
    
    // Customer Details
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text('CUSTOMER DETAILS:', 20, 93);
    
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.text(`Name: ${formData.name}`, 20, 103);
    doc.text(`Phone: +91 ${formData.phone}`, 20, 111);
    if (formData.email) doc.text(`Email: ${formData.email}`, 20, 119);
    if (formData.address) doc.text(`Address: ${formData.address}`, 20, 127);
    
    // Service Details
    let yPos = formData.address ? 143 : 135;
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text('SERVICE DETAILS:', 20, yPos);
    
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.text(`Purifier Brand: ${formData.brand}`, 20, yPos + 10);
    
    // Spare Parts Used
    yPos += 20;
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('Spare Parts:', 20, yPos);
    
    yPos += 8;
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    let partCount = 0;
    Object.entries(formData.spareParts).forEach(([part, used]) => {
      if (used) {
        partCount++;
        doc.text(`  ${partCount}. ${part} - Completed`, 25, yPos);
        yPos += 7;
      }
    });
    
    if (partCount === 0) {
      doc.text('  No parts replaced', 25, yPos);
      yPos += 7;
    }
    
    // Payment Details
    yPos += 5;
    doc.setFillColor(240, 240, 240);
    doc.rect(20, yPos, pageWidth - 40, 25, 'F');
    
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text('PAYMENT DETAILS:', 25, yPos + 10);
    
    doc.setFontSize(10);
    doc.setTextColor(0, 128, 0);
    doc.setFont(undefined, 'bold');
    const amountText = formData.amount ? `Amount Paid: Rs.${formData.amount} (${formData.paymentMode})` : 'Service Activated';
    doc.text(amountText, 25, yPos + 19);
    
    // Notes Section
    yPos += 35;
    if (formData.notes) {
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.text('NOTES:', 20, yPos);
      
      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      const noteLines = doc.splitTextToSize(formData.notes, pageWidth - 40);
      yPos += 8;
      noteLines.forEach(line => {
        doc.text(line, 20, yPos);
        yPos += 6;
      });
      yPos += 5;
    }
    
    // Footer
    doc.setLineWidth(0.5);
    doc.line(20, 260, pageWidth - 20, 260);
    
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.text('Thank you for choosing MKL Enterprises!', pageWidth / 2, 270, { align: 'center' });
    doc.setFontSize(8);
    doc.text('For support: Contact 8179019929', pageWidth / 2, 277, { align: 'center' });
    
    doc.save(`Custom_Invoice_${formData.name}_${Date.now()}.pdf`);
    toast.success('Invoice downloaded!');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Custom Invoice</h1>
      
      <div className="rounded-xl shadow-lg p-4 md:p-6 space-y-4 bg-white border border-gray-200">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Customer Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
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
            maxLength="10"
            className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="9876543210"
          />
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
          <label className="block text-sm font-semibold text-gray-800 mb-2">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter address"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Purifier Brand <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter brand name"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Spare Parts</label>
          <div className="grid grid-cols-2 gap-2 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
            {Object.keys(formData.spareParts).map((part) => (
              <label key={part} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.spareParts[part]}
                  onChange={() => handleCheckboxChange(part)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{part}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Upload Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formData.images.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-3">
              {formData.images.map((img, idx) => (
                <img key={idx} src={img} alt="Service" className="w-full h-24 object-cover rounded" />
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter amount"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Payment Method</label>
          <div className="flex gap-4">
            {['Cash', 'UPI', 'Card'].map(mode => (
              <label key={mode} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMode"
                  value={mode}
                  checked={formData.paymentMode === mode}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">{mode}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Additional Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Add any additional notes or comments..."
          />
        </div>

        <button
          onClick={generateInvoice}
          className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-md"
        >
          <Download size={20} />
          Generate & Download Invoice
        </button>
      </div>
    </div>
  );
};

export default CustomInvoice;
