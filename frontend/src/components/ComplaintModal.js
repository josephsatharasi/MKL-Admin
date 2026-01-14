import React, { useState, useEffect } from 'react';
import { X, Edit2, Save } from 'lucide-react';
import { toast } from 'react-toastify';

const ComplaintModal = ({ complaint, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    subject: complaint.subject,
    body: complaint.body,
    status: complaint.status
  });
  const [currentComplaint, setCurrentComplaint] = useState(complaint);

  useEffect(() => {
    setCurrentComplaint(complaint);
    setFormData({
      subject: complaint.subject,
      body: complaint.body,
      status: complaint.status
    });
  }, [complaint]);

  const handleSave = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/complaints/${complaint._id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to update');

      await response.json();
      toast.success('Complaint updated successfully!');
      setIsEditing(false);
      await onUpdate();
      onClose();
    } catch (error) {
      toast.error('Failed to update complaint');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center" style={{background: '#1e3a8a'}}>
          <h2 className="text-xl font-bold text-white">Complaint Details</h2>
          <div className="flex gap-2">
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="text-white hover:opacity-80">
                <Edit2 size={20} />
              </button>
            ) : (
              <button onClick={handleSave} className="text-white hover:opacity-80">
                <Save size={20} />
              </button>
            )}
            <button onClick={onClose} className="text-white hover:opacity-80">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2" style={{color: '#1e3a8a'}}>Customer Name</label>
            <div className="px-4 py-3 bg-gray-100 rounded-lg font-semibold">{currentComplaint.customerName}</div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{color: '#1e3a8a'}}>Subject</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
            ) : (
              <div className="px-4 py-3 bg-gray-100 rounded-lg">{currentComplaint.subject}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{color: '#1e3a8a'}}>Complaint Details</label>
            {isEditing ? (
              <textarea
                rows="8"
                value={formData.body}
                onChange={(e) => setFormData({...formData, body: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
            ) : (
              <div className="px-4 py-3 bg-gray-100 rounded-lg whitespace-pre-wrap">{currentComplaint.body}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{color: '#1e3a8a'}}>Status</label>
            {isEditing ? (
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
              >
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
              </select>
            ) : (
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                currentComplaint.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {currentComplaint.status}
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{color: '#1e3a8a'}}>Submitted Date</label>
            <div className="px-4 py-3 bg-gray-100 rounded-lg">{new Date(currentComplaint.createdAt).toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintModal;
