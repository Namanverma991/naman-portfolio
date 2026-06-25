import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import FormField from '../../components/admin/FormField';
import Toast from '../../components/admin/Toast';
import { FaPlus } from 'react-icons/fa';

const CertificationsPage = () => {
  const { data: certifications } = useSWR('/api/content/certifications');
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', issuer: '', date: '', position_order: 0 });
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleOpen = (item = null) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        title: item.title,
        issuer: item.issuer,
        date: item.date,
        position_order: item.position_order || 0
      });
    } else {
      setEditingId(null);
      setFormData({ title: '', issuer: '', date: '', position_order: certifications ? certifications.length : 0 });
    }
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      title: formData.title,
      issuer: formData.issuer,
      date: formData.date,
      position_order: Number(formData.position_order || 0)
    };

    if (editingId) {
      payload.id = editingId;
    }

    try {
      const res = await fetch('/api/content/certifications', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        mutate('/api/content/certifications');
        setToast({ message: editingId ? 'Certification updated!' : 'Certification added!', type: 'success' });
        handleClose();
      } else {
        setToast({ message: 'Operation failed.', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'An error occurred.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (row) => {
    if (confirm(`Are you sure you want to delete "${row.title}"?`)) {
      try {
        const res = await fetch(`/api/content/certifications?id=${row.id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          mutate('/api/content/certifications');
          setToast({ message: 'Certification entry deleted successfully!', type: 'success' });
        } else {
          setToast({ message: 'Failed to delete certification entry', type: 'error' });
        }
      } catch (err) {
        setToast({ message: 'An error occurred.', type: 'error' });
      }
    }
  };

  const columns = [
    { key: 'title', label: 'Certification Title' },
    { key: 'issuer', label: 'Issuing Organization' },
    { key: 'date', label: 'Issue Date' }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between">
        <h2 className="text-md font-bold text-zinc-350 uppercase tracking-wider">Certifications Management</h2>
        <button
          onClick={() => handleOpen()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-white font-semibold text-xs uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-accent/20"
        >
          <FaPlus /> Add Certification
        </button>
      </div>

      <DataTable
        columns={columns}
        data={certifications || []}
        onEdit={handleOpen}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={editingId ? 'Edit Certification' : 'Add Certification'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Certification Title" id="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Data Structures in Python" />
          <FormField label="Issuing Organization" id="issuer" value={formData.issuer} onChange={handleChange} required placeholder="e.g. IBM, Udemy, Deloitte" />
          <FormField label="Issue Date" id="date" value={formData.date} onChange={handleChange} required placeholder="e.g. August 2025" />
          <FormField label="Position Order" id="position_order" type="number" value={formData.position_order} onChange={handleChange} helpText="Sorting index (0 is first)" />

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-accent hover:opacity-90 active:scale-[0.98] text-white font-semibold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-accent/20 text-xs uppercase tracking-wider disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Certification'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CertificationsPage;
