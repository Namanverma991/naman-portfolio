import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import FormField from '../../components/admin/FormField';
import Toast from '../../components/admin/Toast';
import { FaPlus } from 'react-icons/fa';

const ExperiencePage = () => {
  const { data: experiences } = useSWR('/api/content/experience');
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', company: '', type: 'On-site', period: '', bulletsText: '', position_order: 0 });
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleOpen = (item = null) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        title: item.title,
        company: item.company,
        type: item.type || 'On-site',
        period: item.period,
        bulletsText: item.bullets ? item.bullets.join('\n') : '',
        position_order: item.position_order || 0
      });
    } else {
      setEditingId(null);
      setFormData({ title: '', company: '', type: 'On-site', period: '', bulletsText: '', position_order: experiences ? experiences.length : 0 });
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
    const bullets = formData.bulletsText.split('\n').map(b => b.trim()).filter(b => b !== '');
    const payload = {
      title: formData.title,
      company: formData.company,
      type: formData.type,
      period: formData.period,
      bullets,
      position_order: Number(formData.position_order || 0)
    };

    if (editingId) {
      payload.id = editingId;
    }

    try {
      const res = await fetch('/api/content/experience', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        mutate('/api/content/experience');
        setToast({ message: editingId ? 'Experience updated!' : 'Experience added!', type: 'success' });
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
    if (confirm(`Are you sure you want to delete "${row.title}" at "${row.company}"?`)) {
      try {
        const res = await fetch(`/api/content/experience?id=${row.id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          mutate('/api/content/experience');
          setToast({ message: 'Experience entry deleted successfully!', type: 'success' });
        } else {
          setToast({ message: 'Failed to delete experience', type: 'error' });
        }
      } catch (err) {
        setToast({ message: 'An error occurred.', type: 'error' });
      }
    }
  };

  const columns = [
    { key: 'title', label: 'Job Title' },
    { key: 'company', label: 'Company' },
    { key: 'type', label: 'Job Type' },
    { key: 'period', label: 'Employment Period' },
    { 
      key: 'bullets', 
      label: 'Bullets Count', 
      render: (val) => val ? val.length : 0 
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between">
        <h2 className="text-md font-bold text-zinc-350 uppercase tracking-wider">Experience Management</h2>
        <button
          onClick={() => handleOpen()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-white font-semibold text-xs uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-accent/20"
        >
          <FaPlus /> Add Entry
        </button>
      </div>

      <DataTable
        columns={columns}
        data={experiences || []}
        onEdit={handleOpen}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={editingId ? 'Edit Experience Entry' : 'Add Experience Entry'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Job Title" id="title" value={formData.title} onChange={handleChange} required />
          <FormField label="Company" id="company" value={formData.company} onChange={handleChange} required />
          <FormField 
            label="Job Type" 
            id="type" 
            type="select" 
            value={formData.type} 
            onChange={handleChange} 
            options={[
              { label: 'On-site', value: 'On-site' },
              { label: 'Remote', value: 'Remote' },
              { label: 'Hybrid', value: 'Hybrid' },
              { label: 'Freelance', value: 'Freelance' }
            ]} 
          />
          <FormField label="Period" id="period" value={formData.period} onChange={handleChange} placeholder="e.g. Feb 2026 - Present" required />
          <FormField label="Position Order" id="position_order" type="number" value={formData.position_order} onChange={handleChange} helpText="Sorting order in display list (0 is first)" />
          <FormField 
            label="Key Responsibilities (One per line)" 
            id="bulletsText" 
            type="textarea" 
            rows={5} 
            value={formData.bulletsText} 
            onChange={handleChange} 
            placeholder="Developed scalable Python backend systems...&#10;Integrated OpenAI GPT APIs..." 
          />

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
              {loading ? 'Saving...' : 'Save Entry'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ExperiencePage;
