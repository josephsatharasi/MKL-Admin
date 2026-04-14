import React, { useState, useEffect } from 'react';
import { Search, X, Upload, Save, Download, Plus, Edit2, Trash2 } from 'lucide-react';
import { getCustomers } from '../utils/storage';
import Table from '../components/Table';
import ConfirmModal from '../components/ConfirmModal';
import jsPDF from 'jspdf';

const NewServices = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [areaFilter, setAreaFilter] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [services, setServices] = useState([]);
  const [yearFilter, setYearFilter] = useState('');
  const [showAddService, setShowAddService] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [savedService, setSavedService] = useState(null);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [customerServiceDates, setCustomerServiceDates] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, serviceId: null });
  const API_URL = process.env.REACT_APP_API_URL;
  const [serviceData, setServiceData] = useState({
    spareParts: {
      'Sediment': false,
      'Carbon': false,
      'Spun': false,
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
    images: [],
    totalBill: '',
    paymentMode: 'UPI',
    serviceDate: new Date().toISOString().split('T')[0],
    reminderMonths: '3'
  });

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const data = await getCustomers();
      setCustomers(data);
      await loadAllServiceDates();
      setIsLoading(false);
    };
    loadData();
  }, []);

  const loadAllServiceDates = async () => {
    try {
      // Use optimized API to get all latest service dates at once
      const response = await fetch(`${API_URL}/services/stats/latest-dates`);
      const dates = await response.json();
      setCustomerServiceDates(dates);
    } catch (error) {
      console.error('Error loading service dates:', error);
    }
  };

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.phone.includes(searchTerm);
    const matchesArea = !areaFilter || c.area === areaFilter;
    
    const serviceDate = c.serviceDate ? new Date(c.serviceDate) : new Date();
    const expireDate = new Date(serviceDate);
    expireDate.setMonth(expireDate.getMonth() + parseInt(c.service || 0));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expireDate.setHours(0, 0, 0, 0);
    const isExpired = expireDate < today;
    
    return matchesSearch && matchesArea && !isExpired;
  });

  const getServiceDate = (customerId) => {
    return customerServiceDates[customerId] 
      ? new Date(customerServiceDates[customerId]).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
      : 'No service';
  };

  const getExpireDate = (customer) => {
    const serviceDate = customer.serviceDate ? new Date(customer.serviceDate) : new Date();
    const expireDate = new Date(serviceDate);
    expireDate.setMonth(expireDate.getMonth() + parseInt(customer.service || 0));
    const formattedExpireDate = expireDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expireDate.setHours(0, 0, 0, 0);
    const daysDelayed = Math.floor((today - expireDate) / (1000 * 60 * 60 * 24));
    const isExpired = expireDate < today;
    
    return { formattedExpireDate, isExpired, daysDelayed };
  };

  const handleRowClick = async (customer) => {
    setSelectedCustomer(customer);
    setYearFilter('');
    await loadServices(customer._id);
  };

  const loadServices = async (customerId) => {
    try {
      const response = await fetch(`${API_URL}/services/customer/${customerId}`);
      const data = await response.json();
      console.log('Loaded services:', data);
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setServices(data);
      } else {
        console.error('Services data is not an array:', data);
        setServices([]);
      }
    } catch (error) {
      console.error('Error loading services:', error);
      setServices([]);
    }
  };

  const handleAddService = () => {
    setShowAddService(true);
    setSelectedService(null);
    setServiceData({
      spareParts: {
        'Sediment': false,
        'Carbon': false,
        'Spun': false,
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
      images: [],
      totalBill: '',
      paymentMode: 'UPI',
      serviceDate: new Date().toISOString().split('T')[0],
      reminderMonths: '3'
    });
  };

  const handleViewService = async (service) => {
    console.log('Viewing service:', service);
    
    // Fetch full service details with images
    try {
      const response = await fetch(`${API_URL}/services/${service._id}`);
      const fullService = await response.json();
      setSelectedService(fullService);
    } catch (error) {
      console.error('Error loading full service:', error);
      setSelectedService(service);
    }
    
    setShowAddService(true);
  };

  const handleEditService = async (service, e) => {
    e.stopPropagation();
    console.log('Editing service:', service);
    
    // Fetch full service details with images
    try {
      const response = await fetch(`${API_URL}/services/${service._id}`);
      const fullService = await response.json();
      setSelectedService(fullService);
      setServiceData({
        spareParts: fullService.spareParts,
        images: fullService.images || [],
        totalBill: fullService.totalBill,
        paymentMode: fullService.paymentMode,
        serviceDate: fullService.serviceDate,
        reminderMonths: fullService.reminderMonths?.toString() || '3'
      });
    } catch (error) {
      console.error('Error loading full service:', error);
      setSelectedService(service);
      setServiceData({
        spareParts: service.spareParts,
        images: service.images || [],
        totalBill: service.totalBill,
        paymentMode: service.paymentMode,
        serviceDate: service.serviceDate,
        reminderMonths: service.reminderMonths?.toString() || '3'
      });
    }
    
    setShowAddService(true);
  };

  const handleDeleteService = async (serviceId, e) => {
    e.stopPropagation();
    setDeleteConfirm({ isOpen: true, serviceId });
  };

  const confirmDeleteService = async () => {
    const serviceId = deleteConfirm.serviceId;
    
    try {
      const url = `${API_URL}/services/${serviceId}`;
      console.log('Deleting service at URL:', url);
      
      const response = await fetch(url, {
        method: 'DELETE'
      });
      
      console.log('Delete response status:', response.status);
      
      if (response.ok) {
        console.log('Service deleted successfully');
        
        // Immediately update UI by removing the service from the list
        setServices(prevServices => prevServices.filter(s => s._id !== serviceId));
        
        // Then reload data in background
        await loadAllServiceDates();
      } else {
        const errorData = await response.json();
        console.error('Failed to delete service:', errorData);
        alert(`Failed to delete service: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Error deleting service. Please try again.');
    }
  };

  const handleCheckboxChange = (part) => {
    setServiceData(prev => ({
      ...prev,
      spareParts: { ...prev.spareParts, [part]: !prev.spareParts[part] }
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setServiceData(prev => ({ ...prev, images: [...prev.images, reader.result] }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSaveService = async () => {
    if (!serviceData.totalBill) {
      return;
    }
    
    try {
      const serviceRecord = {
        customerId: selectedCustomer._id,
        customerName: selectedCustomer.name,
        spareParts: serviceData.spareParts,
        totalBill: serviceData.totalBill,
        paymentMode: serviceData.paymentMode,
        images: serviceData.images,
        serviceDate: serviceData.serviceDate,
        reminderMonths: parseInt(serviceData.reminderMonths)
      };
      
      console.log('Saving service with date:', serviceRecord.serviceDate);
      
      // Check if we're editing an existing service
      const isEditing = selectedService && selectedService._id;
      const url = isEditing 
        ? `${API_URL}/services/${selectedService._id}`
        : `${API_URL}/services`;
      const method = isEditing ? 'PUT' : 'POST';
      
      console.log(`${method} request to:`, url);
      
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceRecord)
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const savedServiceData = await response.json();
        console.log('Saved service:', savedServiceData);
        setSavedService(savedServiceData);
        
        // Update customer's serviceDate and service period
        const updateResponse = await fetch(`${API_URL}/customers/${selectedCustomer._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            serviceDate: serviceData.serviceDate,
            service: serviceData.reminderMonths
          })
        });
        
        if (updateResponse.ok) {
          console.log('Service saved and expiry date updated!');
        } else {
          console.log('Service saved successfully!');
        }
        
        await loadServices(selectedCustomer._id);
        await loadAllServiceDates();
      }
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  const handleStatusChange = async (customerId, status) => {
    try {
      await fetch(`${API_URL}/customers/${customerId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const updatedCustomers = await getCustomers();
      setCustomers(updatedCustomers);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const generateServiceInvoice = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Header - Dark Blue Background
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
    doc.text('SERVICE RECEIPT', pageWidth / 2, 63, { align: 'center' });
    
    // Receipt ID and Date
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(20, 70, pageWidth - 20, 70);
    
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    const receiptId = `#${Date.now().toString().slice(-4)}`;
    const serviceDate = new Date(savedService.serviceDate).toLocaleDateString('en-GB').replace(/\//g, '/');
    doc.text(`Receipt ID: ${receiptId}`, 20, 78);
    doc.text(`Date: ${serviceDate}`, pageWidth - 20, 78, { align: 'right' });
    
    // Customer Details Section
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text('CUSTOMER DETAILS:', 20, 93);
    
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.text(`Name: ${selectedCustomer.name}`, 20, 103);
    doc.text(`Phone: +91 ${selectedCustomer.phone}`, 20, 111);
    doc.text(`Email: ${selectedCustomer.email}`, 20, 119);
    doc.text(`Address: ${selectedCustomer.address}`, 20, 127);
    
    // Service Details Section
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text('SERVICE DETAILS:', 20, 143);
    
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.text(`Purifier Brand: ${selectedCustomer.brand}`, 20, 153);
    doc.text('Spare Parts Replaced:', 20, 161);
    
    let yPos = 169;
    let partCount = 0;
    Object.entries(savedService.spareParts).forEach(([part, used]) => {
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
    
    // Payment Details Section
    yPos += 5;
    doc.setFillColor(240, 240, 240);
    doc.rect(20, yPos, pageWidth - 40, 25, 'F');
    
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text('PAYMENT DETAILS:', 25, yPos + 10);
    
    doc.setFontSize(10);
    doc.setTextColor(0, 128, 0);
    doc.setFont(undefined, 'bold');
    doc.text(`Amount Paid: Rs.${savedService.totalBill} (${savedService.paymentMode})`, 25, yPos + 19);
    
    // Footer Line
    yPos += 35;
    doc.setLineWidth(0.5);
    doc.line(20, yPos, pageWidth - 20, yPos);
    
    // Footer
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.text('Thank you for choosing MKL Enterprises!', pageWidth / 2, yPos + 10, { align: 'center' });
    doc.setFontSize(8);
    doc.text('For support: Contact 8179019929', pageWidth / 2, yPos + 17, { align: 'center' });
    
    doc.save(`Service_Receipt_${selectedCustomer.name}_${Date.now()}.pdf`);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">New Services</h1>
        <p className="text-gray-600">Search and manage customer services</p>
      </div>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3" style={{color: '#1e3a8a'}} size={20} />
          <input
            type="text"
            placeholder="Search by name or phone number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border-2 rounded-lg focus:outline-none focus:ring-2 shadow-sm" style={{borderColor: '#1e3a8a33'}}
          />
        </div>
        <select
          value={areaFilter}
          onChange={(e) => setAreaFilter(e.target.value)}
          className="w-full px-4 py-3 bg-white border-2 rounded-lg focus:outline-none focus:ring-2 shadow-sm" style={{borderColor: '#1e3a8a33'}}
        >
          <option value="">All Areas</option>
          <option value="Akkayapalem">Akkayapalem</option>
          <option value="Allipuram">Allipuram</option>
          <option value="Anakapelly">Anakapelly</option>
          <option value="Anumanthwada">Anumanthwada</option>
          <option value="Birla Junction">Birla Junction</option>
          <option value="Bujjirajupalem">Bujjirajupalem</option>
          <option value="Chinna Musaliwada">Chinna Musaliwada</option>
          <option value="Chinnawaltair">Chinnawaltair</option>
          <option value="Chodavaram">Chodavaram</option>
          <option value="Dabagardens">Dabagardens</option>
          <option value="Duvvada">Duvvada</option>
          <option value="Dwarakanagar">Dwarakanagar</option>
          <option value="Endada">Endada</option>
          <option value="Gajuwaka">Gajuwaka</option>
          <option value="Gopalapatnam">Gopalapatnam</option>
          <option value="Hanumanthwada">Hanumanthwada</option>
          <option value="Kancherapalem">Kancherapalem</option>
          <option value="Koramanapalem">Koramanapalem</option>
          <option value="Kothavalasa">Kothavalasa</option>
          <option value="Maddipalem">Maddipalem</option>
          <option value="Madhurapalem">Madhurapalem</option>
          <option value="Madhuruwada">Madhuruwada</option>
          <option value="Malkapuram">Malkapuram</option>
          <option value="Marripalem">Marripalem</option>
          <option value="MVP Colony">MVP Colony</option>
          <option value="NAD Junction">NAD Junction</option>
          <option value="Naiduthota">Naiduthota</option>
          <option value="Peddawaltair">Peddawaltair</option>
          <option value="Pendurthi">Pendurthi</option>
          <option value="PM Palem">PM Palem</option>
          <option value="Poorana Market">Poorana Market</option>
          <option value="RTC Complex">RTC Complex</option>
          <option value="Sabbavaram">Sabbavaram</option>
          <option value="Sheelanagar">Sheelanagar</option>
          <option value="Shulanager">Shulanager</option>
          <option value="Siripuram">Siripuram</option>
          <option value="Skota">Skota</option>
          <option value="Sriharipuram">Sriharipuram</option>
          <option value="Sujathanagar">Sujathanagar</option>
          <option value="Vepagunta">Vepagunta</option>
        </select>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
          <p className="mt-4 text-gray-600">Loading customers...</p>
        </div>
      ) : (
      <Table
        columns={[
          { header: 'Name', field: 'name', bold: true, color: '#1e3a8a' },
          { header: 'Phone', field: 'phone' },
          { header: 'Area', field: 'area', hideOnMobile: true },
          { header: 'Address', field: 'address', hideOnTablet: true },
          { header: 'Service', render: (customer) => `${customer.service}M` },
          { header: 'Brand', field: 'brand' },
          { header: 'Service Date', bold: true, color: '#1e3a8a', render: (customer) => getServiceDate(customer._id) },
          { header: 'Expire Date', bold: true, render: (customer) => {
            const { formattedExpireDate, isExpired, daysDelayed } = getExpireDate(customer);
            return (
              <span style={{color: isExpired ? '#ef4444' : '#10b981'}}>
                {formattedExpireDate}
                {isExpired && <span className="ml-2 text-xs">({daysDelayed}d delay)</span>}
              </span>
            );
          }}
        ]}
        data={filteredCustomers}
        onRowClick={handleRowClick}
        emptyMessage="No customers found"
      />
      )}

      {selectedCustomer && !showAddService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedCustomer(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="text-white p-6 flex justify-between items-center" style={{background: '#1e3a8a'}}>
              <h2 className="text-2xl font-bold">Service History - {selectedCustomer.name}</h2>
              <button onClick={() => setSelectedCustomer(null)} className="hover:bg-blue-500 p-2 rounded-lg transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-3">
                  <h3 className="font-bold text-blue-900">All Services</h3>
                  <div className="flex gap-2 w-full md:w-auto">
                    <select
                      value={yearFilter}
                      onChange={(e) => setYearFilter(e.target.value)}
                      className="px-3 py-2 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="">All Years</option>
                      {Array.isArray(services) && services.length > 0 && [...new Set(services.map(s => new Date(s.serviceDate).getFullYear()))]
                        .sort((a, b) => b - a)
                        .map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                    <button
                      onClick={handleAddService}
                      className="flex items-center gap-2 text-white px-4 py-2 rounded-lg transition-colors font-semibold text-sm" style={{background: '#1e3a8a'}}
                    >
                      <Plus size={18} />
                      Add New Service
                    </button>
                  </div>
                </div>
                {Array.isArray(services) && services.filter(s => !yearFilter || new Date(s.serviceDate).getFullYear().toString() === yearFilter).length > 0 ? (
                  <div className="space-y-2">
                    {services
                      .filter(s => !yearFilter || new Date(s.serviceDate).getFullYear().toString() === yearFilter)
                      .map((service) => (
                      <div
                        key={service._id}
                        onClick={() => handleViewService(service)}
                        className="p-3 bg-white rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-blue-900">Service Date: {new Date(service.serviceDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                            <p className="text-sm text-gray-600">Total: ₹{service.totalBill} | Payment: {service.paymentMode}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => handleEditService(service, e)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                              title="Edit Service"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={(e) => handleDeleteService(service._id, e)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                              title="Delete Service"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">{yearFilter ? `No services found for ${yearFilter}` : 'No service history'}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setShowAddService(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="text-white p-6 flex justify-between items-center" style={{background: '#1e3a8a'}}>
              <h2 className="text-2xl font-bold">
                {selectedService && !serviceData.totalBill ? 'View Service' : selectedService ? 'Edit Service' : 'Add New Service'}
              </h2>
              <button onClick={() => setShowAddService(false)} className="hover:bg-blue-500 p-2 rounded-lg transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {selectedService && !serviceData.totalBill ? (
                <>
                  <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                    <h3 className="font-bold text-blue-900 mb-3">Service Details</h3>
                    <p className="text-sm text-gray-700 mb-2"><strong>Date:</strong> {new Date(selectedService.serviceDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                    <p className="text-sm text-gray-700 mb-2"><strong>Total Bill:</strong> ₹{selectedService.totalBill}</p>
                    <p className="text-sm text-gray-700"><strong>Payment Mode:</strong> {selectedService.paymentMode}</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                    <h3 className="font-bold text-blue-900 mb-3">Spare Parts Used</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(selectedService.spareParts).map(([part, used]) => (
                        used && <span key={part} className="text-sm text-gray-700">✓ {part}</span>
                      ))}
                    </div>
                  </div>
                  {selectedService.images && selectedService.images.length > 0 ? (
                    <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                      <h3 className="font-bold text-blue-900 mb-3">Service Images ({selectedService.images.length})</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedService.images.map((img, idx) => (
                          <img 
                            key={idx} 
                            src={img} 
                            alt="Service" 
                            className="w-full h-48 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity" 
                            onClick={() => setFullScreenImage(img)}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                      <p className="text-sm text-gray-500 text-center">No images uploaded for this service</p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                    <h3 className="font-bold text-blue-900 mb-3">Spare Parts</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.keys(serviceData.spareParts).map((part) => (
                        <label key={part} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={serviceData.spareParts[part]}
                            onChange={() => handleCheckboxChange(part)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{part}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                    <h3 className="font-bold text-blue-900 mb-3">Service Date & Reminder</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Service Date</label>
                        <input
                          type="date"
                          value={serviceData.serviceDate}
                          onChange={(e) => setServiceData(prev => ({ ...prev, serviceDate: e.target.value }))}
                          className="w-full px-4 py-2 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">Next Service Reminder</label>
                        <div className="flex gap-4">
                          {['3', '6', '12'].map(months => (
                            <label key={months} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                value={months}
                                checked={serviceData.reminderMonths === months}
                                onChange={(e) => setServiceData(prev => ({ ...prev, reminderMonths: e.target.value }))}
                                className="w-4 h-4 text-blue-600"
                              />
                              <span className="text-sm text-gray-700">{months} Months</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                    <h3 className="font-bold text-blue-900 mb-3">Upload Images</h3>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full px-4 py-2 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {serviceData.images.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mt-3">
                        {serviceData.images.map((img, idx) => (
                          <img key={idx} src={img} alt="Service" className="w-full h-24 object-cover rounded" />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                    <h3 className="font-bold text-blue-900 mb-3">Billing Details</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Total Bill <span className="text-red-600">*</span></label>
                        <input
                          type="number"
                          value={serviceData.totalBill}
                          onChange={(e) => setServiceData(prev => ({ ...prev, totalBill: e.target.value }))}
                          placeholder="Enter total amount"
                          required
                          className="w-full px-4 py-2 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">Payment Mode</label>
                        <div className="flex gap-4">
                          {['UPI', 'Cash', 'Card'].map(mode => (
                            <label key={mode} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                value={mode}
                                checked={serviceData.paymentMode === mode}
                                onChange={(e) => setServiceData(prev => ({ ...prev, paymentMode: e.target.value }))}
                                className="w-4 h-4 text-blue-600"
                              />
                              <span className="text-sm text-gray-700">{mode}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {savedService ? (
                      <>
                        <button
                          onClick={generateServiceInvoice}
                          className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                        >
                          <Download size={20} />
                          Download Invoice
                        </button>
                        <button
                          onClick={() => { setShowAddService(false); setSavedService(null); }}
                          className="flex-1 flex items-center justify-center gap-2 text-white py-3 rounded-lg transition-colors font-semibold" style={{background: '#1e3a8a'}}
                        >
                          Close
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={handleSaveService}
                          className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                        >
                          <Save size={20} />
                          {selectedService ? 'Update Service' : 'Save Service'}
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {fullScreenImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4" onClick={() => setFullScreenImage(null)}>
          <img src={fullScreenImage} alt="Full screen" className="max-w-full max-h-full object-contain" onClick={(e) => e.stopPropagation()} />
          <div className="absolute top-4 right-4 flex gap-2">
            <a 
              href={fullScreenImage} 
              download={`service-image-${Date.now()}.jpg`}
              className="text-white text-2xl hover:text-gray-300 bg-black bg-opacity-50 p-2 rounded"
              onClick={(e) => e.stopPropagation()}
            >
              <Download size={24} />
            </a>
            <button onClick={() => setFullScreenImage(null)} className="text-white text-2xl hover:text-gray-300 bg-black bg-opacity-50 p-2 rounded">
              <X size={24} />
            </button>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, serviceId: null })}
        onConfirm={confirmDeleteService}
        title="Delete Service Record"
        message="Are you sure you want to delete this service record? This action cannot be undone."
      />
    </div>
  );
};

export default NewServices;
