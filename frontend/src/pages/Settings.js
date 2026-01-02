import React, { useState, useEffect } from 'react';
import { Save, Bell, Mail, Shield, Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { getPartners, addPartner, deletePartner } from '../utils/partners';

const Settings = () => {
  const [settings, setSettings] = useState({
    alertDays: 7,
    emailNotifications: true,
    smsNotifications: false,
    companyName: 'MKL Enterprises',
    companyEmail: 'support@mklenterprises.com',
    companyPhone: '+91 1234567890',
  });

  const [partners, setPartners] = useState([]);
  const [newPartner, setNewPartner] = useState({ name: '', price3Months: '' });

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = () => {
    setPartners(getPartners());
  };

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  const handleAddPartner = (e) => {
    e.preventDefault();
    if (newPartner.name && newPartner.price3Months) {
      addPartner({ ...newPartner, price3Months: parseFloat(newPartner.price3Months) });
      setNewPartner({ name: '', price3Months: '' });
      loadPartners();
      toast.success(`${newPartner.name} added successfully!`);
    }
  };

  const handleDeletePartner = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      deletePartner(id);
      loadPartners();
      toast.success(`${name} deleted!`);
    }
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">Settings</h1>

      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="text-blue-600" />
            <h2 className="text-xl font-bold text-blue-900">Alert Settings</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-2">
                Alert Threshold (Days before expiry)
              </label>
              <input
                type="number"
                value={settings.alertDays}
                onChange={(e) => setSettings({ ...settings, alertDays: e.target.value })}
                className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="text-blue-600" />
            <h2 className="text-xl font-bold text-blue-900">Notification Settings</h2>
          </div>
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                className="w-5 h-5"
              />
              <span className="text-blue-900">Enable Email Notifications</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.smsNotifications}
                onChange={(e) => setSettings({ ...settings, smsNotifications: e.target.checked })}
                className="w-5 h-5"
              />
              <span className="text-blue-900">Enable SMS Notifications</span>
            </label>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="text-blue-600" />
            <h2 className="text-xl font-bold text-blue-900">Partner Management</h2>
          </div>
          
          <form onSubmit={handleAddPartner} className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Partner Name (e.g., Kent RO)"
                value={newPartner.name}
                onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                className="px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="number"
                placeholder="3 Months Price (₹)"
                value={newPartner.price3Months}
                onChange={(e) => setNewPartner({ ...newPartner, price3Months: e.target.value })}
                className="px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors font-semibold"
              >
                <Plus size={20} />
                Add Partner
              </button>
            </div>
          </form>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-900 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Partner Name</th>
                  <th className="px-4 py-3 text-left">3 Months</th>
                  <th className="px-4 py-3 text-left">6 Months</th>
                  <th className="px-4 py-3 text-left">12 Months</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {partners.map((partner, index) => (
                  <tr key={partner.id} className={index % 2 === 0 ? 'bg-blue-50' : 'bg-white'}>
                    <td className="px-4 py-3 font-semibold text-blue-900">{partner.name}</td>
                    <td className="px-4 py-3">₹{partner.price3Months}</td>
                    <td className="px-4 py-3">₹{partner.price3Months * 2}</td>
                    <td className="px-4 py-3">₹{partner.price3Months * 4}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDeletePartner(partner.id, partner.name)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors font-semibold shadow-md"
        >
          <Save size={20} />
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;
