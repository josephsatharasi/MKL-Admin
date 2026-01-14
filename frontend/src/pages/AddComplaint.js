import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FileText } from 'lucide-react';

const AddComplaint = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerName: '',
    subject: '',
    body: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/complaints`, {
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
          <div>
            <label className="block text-sm font-semibold mb-2" style={{color: '#1e3a8a'}}>
              Customer Name *
            </label>
            <input
              type="text"
              required
              value={formData.customerName}
              onChange={(e) => setFormData({...formData, customerName: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
              placeholder="Enter customer name (must exist in system)"
            />
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
