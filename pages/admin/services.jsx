import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import FormField from '../../components/admin/FormField';
import Toast from '../../components/admin/Toast';
import { FaPlus } from 'react-icons/fa';
import * as RxIcons from 'react-icons/rx';

const ServicesPage = () => {
  const { data: services } = useSWR('/api/content/services');
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ icon: 'RxDesktop', title: '', description: '', position_order: 0 });
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleOpen = (item = null) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        icon: item.icon || 'RxDesktop',
        title: item.title,
        description: item.description,
        position_order: item.position_order || 0
      });
    } else {
      setEditingId(null);
      setFormData({ icon: 'RxDesktop', title: '', description: '', position_order: services ? services.length : 0 });
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
      icon: formData.icon,
      title: formData.title,
      description: formData.description,
      position_order: Number(formData.position_order || 0)
    };

    if (editingId) {
      payload.id = editingId;
    }

    try {
      const res = await fetch('/api/content/services', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        mutate('/api/content/services');
        setToast({ message: editingId ? 'Service updated!' : 'Service added!', type: 'success' });
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
        const res = await fetch(`/api/content/services?id=${row.id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          mutate('/api/content/services');
          setToast({ message: 'Service entry deleted successfully!', type: 'success' });
        } else {
          setToast({ message: 'Failed to delete service entry', type: 'error' });
        }
      } catch (err) {
        setToast({ message: 'An error occurred.', type: 'error' });
      }
    }
  };

  const renderIcon = (iconName) => {
    const IconComponent = RxIcons[iconName];
    return IconComponent ? <IconComponent className="text-lg text-accent" /> : <span>{iconName}</span>;
  };

  const columns = [
    { 
      key: 'icon', 
      label: 'Icon', 
      render: (val) => renderIcon(val) 
    },
    { key: 'title', label: 'Service Title' },
    { key: 'description', label: 'Description' }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between">
        <h2 className="text-md font-bold text-zinc-350 uppercase tracking-wider">Services Configuration</h2>
        <button
          onClick={() => handleOpen()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-white font-semibold text-xs uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-accent/20"
        >
          <FaPlus /> Add Service
        </button>
      </div>

      <DataTable
        columns={columns}
        data={services || []}
        onEdit={handleOpen}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={editingId ? 'Edit Service' : 'Add Service'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField 
            label="Service Icon" 
            id="icon" 
            type="select" 
            value={formData.icon} 
            onChange={handleChange} 
            options={[
              { label: 'RxBarChart (Analytics)', value: 'RxBarChart' },
              { label: 'RxRocket (Machine Learning)', value: 'RxRocket' },
              { label: 'RxDashboard (Visualizations)', value: 'RxDashboard' },
              { label: 'RxDesktop (Web Development)', value: 'RxDesktop' },
              { label: 'RxLightningBolt (Engineering)', value: 'RxLightningBolt' }
            ]} 
          />
          <FormField label="Service Title" id="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Data Analysis" />
          <FormField label="Position Order" id="position_order" type="number" value={formData.position_order} onChange={handleChange} helpText="Sorting index (0 is first)" />
          <FormField label="Description" id="description" type="textarea" rows={4} value={formData.description} onChange={handleChange} required placeholder="Transforming raw data into meaningful insights..." />

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
              {loading ? 'Saving...' : 'Save Service'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ServicesPage;
