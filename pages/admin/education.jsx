import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import FormField from '../../components/admin/FormField';
import Toast from '../../components/admin/Toast';
import { FaPlus } from 'react-icons/fa';

const EducationPage = () => {
  const { data: education } = useSWR('/api/content/education');
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ institution: '', degree: '', gpa: '', period: '', position_order: 0 });
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleOpen = (item = null) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        institution: item.institution,
        degree: item.degree,
        gpa: item.gpa || '',
        period: item.period,
        position_order: item.position_order || 0
      });
    } else {
      setEditingId(null);
      setFormData({ institution: '', degree: '', gpa: '', period: '', position_order: education ? education.length : 0 });
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
      institution: formData.institution,
      degree: formData.degree,
      gpa: formData.gpa,
      period: formData.period,
      position_order: Number(formData.position_order || 0)
    };

    if (editingId) {
      payload.id = editingId;
    }

    try {
      const res = await fetch('/api/content/education', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        mutate('/api/content/education');
        setToast({ message: editingId ? 'Education record updated!' : 'Education record added!', type: 'success' });
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
    if (confirm(`Are you sure you want to delete "${row.degree}" at "${row.institution}"?`)) {
      try {
        const res = await fetch(`/api/content/education?id=${row.id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          mutate('/api/content/education');
          setToast({ message: 'Education entry deleted successfully!', type: 'success' });
        } else {
          setToast({ message: 'Failed to delete education entry', type: 'error' });
        }
      } catch (err) {
        setToast({ message: 'An error occurred.', type: 'error' });
      }
    }
  };

  const columns = [
    { key: 'degree', label: 'Degree / Course' },
    { key: 'institution', label: 'Institution' },
    { key: 'gpa', label: 'GPA / Grade' },
    { key: 'period', label: 'Period' }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between">
        <h2 className="text-md font-bold text-zinc-350 uppercase tracking-wider">Education History</h2>
        <button
          onClick={() => handleOpen()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-white font-semibold text-xs uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-accent/20"
        >
          <FaPlus /> Add Record
        </button>
      </div>

      <DataTable
        columns={columns}
        data={education || []}
        onEdit={handleOpen}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={editingId ? 'Edit Education Record' : 'Add Education Record'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Degree / Course" id="degree" value={formData.degree} onChange={handleChange} required placeholder="e.g. BTech in Computer Science" />
          <FormField label="Institution" id="institution" value={formData.institution} onChange={handleChange} required placeholder="e.g. Hindustan College of Science and Technology" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="GPA / Score" id="gpa" value={formData.gpa} onChange={handleChange} placeholder="e.g. CGPA: 7.2 or 80%" />
            <FormField label="Period" id="period" value={formData.period} onChange={handleChange} required placeholder="e.g. September 2022 - August 2026" />
          </div>
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
              {loading ? 'Saving...' : 'Save Record'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EducationPage;
