import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Search, FileText } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';
import ComplaintModal from '../components/ComplaintModal';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [complaintToDelete, setComplaintToDelete] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/complaints`, {
        headers: { 'Cache-Control': 'no-cache' }
      });
      const data = await response.json();
      setComplaints(data);
    } catch (error) {
      console.error('Failed to load complaints');
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/complaints/${complaintToDelete.id}`, {
        method: 'DELETE'
      });
      loadComplaints();
    } catch (error) {
      console.error('Failed to delete complaint');
    }
  };

  const toggleStatus = async (e, id, newStatus) => {
    e.stopPropagation();
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/complaints/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      loadComplaints();
    } catch (error) {
      console.error('Failed to update status');
    }
  };

  const filteredComplaints = complaints.filter(c =>
    c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Customer Complaints</h1>
        <Link
          to="/admin/add-complaint"
          className="flex items-center gap-2 px-6 py-3 text-white rounded-lg font-semibold shadow-md hover:opacity-90 transition-opacity"
          style={{background: '#1e3a8a'}}
        >
          <FileText size={20} />
          New Complaint
        </Link>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-primary" size={20} />
          <input
            type="text"
            placeholder="Search by customer name or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border-2 border-primary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
          />
        </div>
      </div>

      <div className="rounded-xl shadow-lg overflow-hidden bg-white mb-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead className="text-white sticky top-0 z-10" style={{background: '#1e3a8a'}}>
              <tr>
                <th className="px-4 md:px-6 py-3 text-left text-sm">Customer Name</th>
                <th className="px-4 md:px-6 py-3 text-left text-sm">Subject</th>
                <th className="px-4 md:px-6 py-3 text-left text-sm hidden md:table-cell">Details</th>
                <th className="px-4 md:px-6 py-3 text-left text-sm hidden lg:table-cell">Date</th>
                <th className="px-4 md:px-6 py-3 text-left text-sm">Status</th>
                <th className="px-4 md:px-6 py-3 text-left text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.map((complaint, index) => (
                <tr 
                  key={complaint._id}
                  onClick={() => setSelectedComplaint(complaint)}
                  className="cursor-pointer hover:bg-blue-50"
                  style={{backgroundColor: index % 2 !== 0 ? '#1e3a8a1A' : 'white'}}
                >
                  <td className="px-4 md:px-6 py-4 text-sm font-semibold" style={{color: '#1e3a8a'}}>
                    {complaint.customerName}
                  </td>
                  <td className="px-4 md:px-6 py-4 text-sm">
                    {complaint.subject.length > 15 ? complaint.subject.substring(0, 15) + '....' : complaint.subject}
                  </td>
                  <td className="px-4 md:px-6 py-4 text-sm hidden md:table-cell">
                    {complaint.body.length > 15 ? complaint.body.substring(0, 15) + '....' : complaint.body}
                  </td>
                  <td className="px-4 md:px-6 py-4 text-sm hidden lg:table-cell">
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 md:px-6 py-4 text-sm" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={complaint.status}
                      onChange={(e) => toggleStatus(e, complaint._id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer ${
                        complaint.status === 'resolved'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-sm" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => setComplaintToDelete({ id: complaint._id, name: complaint.customerName })}
                      className="text-red-500 hover:text-red-700 hover:scale-110 transition-transform"
                      title="Delete Complaint"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredComplaints.length === 0 && (
          <div className="text-center py-8 text-gray-500">No complaints found</div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!complaintToDelete}
        onClose={() => setComplaintToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Complaint"
        message={`Are you sure you want to delete this complaint from ${complaintToDelete?.name}?`}
      />

      {selectedComplaint && (
        <ComplaintModal
          complaint={selectedComplaint}
          onClose={() => {
            setSelectedComplaint(null);
          }}
          onUpdate={() => {
            loadComplaints();
          }}
        />
      )}
    </div>
  );
};

export default Complaints;
