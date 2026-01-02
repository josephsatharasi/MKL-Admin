import React, { useState, useEffect } from 'react';
import { Download, TrendingUp, Calendar } from 'lucide-react';
import { getCustomers, getDaysUntilExpiry } from '../utils/storage';
import jsPDF from 'jspdf';

const Reports = () => {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expiring: 0,
    expired: 0,
    revenue: 0,
  });

  useEffect(() => {
    const customers = getCustomers();
    const active = customers.filter(c => getDaysUntilExpiry(c.endDate) > 7).length;
    const expiring = customers.filter(c => {
      const days = getDaysUntilExpiry(c.endDate);
      return days > 0 && days <= 7;
    }).length;
    const expired = customers.filter(c => getDaysUntilExpiry(c.endDate) < 0).length;

    setStats({
      total: customers.length,
      active,
      expiring,
      expired,
      revenue: customers.length * 500,
    });
  }, []);

  const generateReport = () => {
    const doc = new jsPDF();
    const customers = getCustomers();

    doc.setFillColor(25, 55, 109);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('MKL ENTERPRISES', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text('MONTHLY REPORT', 105, 30, { align: 'center' });

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text('Summary Statistics', 20, 55);
    doc.setFontSize(10);
    doc.text(`Total Customers: ${stats.total}`, 20, 65);
    doc.text(`Active: ${stats.active}`, 20, 72);
    doc.text(`Expiring Soon: ${stats.expiring}`, 20, 79);
    doc.text(`Expired: ${stats.expired}`, 20, 86);

    doc.save(`MKL_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-[#19376D] mb-6">Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-3xl font-bold text-[#19376D]">{stats.total}</p>
            </div>
            <TrendingUp size={40} className="text-[#576CBC]" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Plans</p>
              <p className="text-3xl font-bold text-green-600">{stats.active}</p>
            </div>
            <Calendar size={40} className="text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Est. Revenue</p>
              <p className="text-3xl font-bold text-[#19376D]">₹{stats.revenue}</p>
            </div>
            <TrendingUp size={40} className="text-[#576CBC]" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-[#19376D] mb-4">Generate Report</h2>
        <button
          onClick={generateReport}
          className="flex items-center gap-2 bg-[#576CBC] text-white px-6 py-3 rounded-lg hover:bg-[#19376D] transition-colors"
        >
          <Download size={20} />
          Download PDF Report
        </button>
      </div>
    </div>
  );
};

export default Reports;
