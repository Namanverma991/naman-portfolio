import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import FormField from '../../components/admin/FormField';
import Toast from '../../components/admin/Toast';
import { FaPlus, FaExternalLinkAlt } from 'react-icons/fa';

const ProjectsPage = () => {
  const { data: projects } = useSWR('/api/content/projects');
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', subtitle: '', description: '', technologiesText: '', link: '', image_path: '', featured: false, position_order: 0 });
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleOpen = (item = null) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        title: item.title,
        subtitle: item.subtitle || '',
        description: item.description || '',
        technologiesText: item.technologies ? item.technologies.join(', ') : '',
        link: item.link || '',
        image_path: item.image_path || '',
        featured: !!item.featured,
        position_order: item.position_order || 0
      });
    } else {
      setEditingId(null);
      setFormData({ title: '', subtitle: '', description: '', technologiesText: '', link: '', image_path: '/thumb1.png', featured: true, position_order: projects ? projects.length : 0 });
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
    const technologies = formData.technologiesText.split(',').map(t => t.trim()).filter(t => t !== '');
    const payload = {
      title: formData.title,
      subtitle: formData.subtitle,
      description: formData.description,
      technologies,
      link: formData.link,
      image_path: formData.image_path,
      featured: !!formData.featured,
      position_order: Number(formData.position_order || 0)
    };

    if (editingId) {
      payload.id = editingId;
    }

    try {
      const res = await fetch('/api/content/projects', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        mutate('/api/content/projects');
        setToast({ message: editingId ? 'Project updated!' : 'Project added!', type: 'success' });
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
        const res = await fetch(`/api/content/projects?id=${row.id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          mutate('/api/content/projects');
          setToast({ message: 'Project deleted successfully!', type: 'success' });
        } else {
          setToast({ message: 'Failed to delete project', type: 'error' });
        }
      } catch (err) {
        setToast({ message: 'An error occurred.', type: 'error' });
      }
    }
  };

  const columns = [
    { 
      key: 'image_path', 
      label: 'Image', 
      render: (val) => val ? (
        <img src={val} alt="thumb" className="w-12 h-10 object-cover rounded-lg border border-zinc-850 bg-zinc-950" />
      ) : '-'
    },
    { key: 'title', label: 'Title' },
    { key: 'subtitle', label: 'Subtitle' },
    { 
      key: 'technologies', 
      label: 'Technologies', 
      render: (val) => val ? val.join(', ') : '' 
    },
    { 
      key: 'featured', 
      label: 'Featured', 
      render: (val) => val ? (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-accent/20 text-accent">Featured</span>
      ) : 'No' 
    },
    { 
      key: 'link', 
      label: 'Project Link', 
      render: (val) => val ? (
        <a href={val} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline inline-flex items-center gap-1">
          Link <FaExternalLinkAlt className="text-[10px]" />
        </a>
      ) : '-'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between">
        <h2 className="text-md font-bold text-zinc-350 uppercase tracking-wider">Projects Management</h2>
        <button
          onClick={() => handleOpen()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-white font-semibold text-xs uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-accent/20"
        >
          <FaPlus /> Add Project
        </button>
      </div>

      <DataTable
        columns={columns}
        data={projects || []}
        onEdit={handleOpen}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={editingId ? 'Edit Project' : 'Add Project'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Project Title" id="title" value={formData.title} onChange={handleChange} required />
          <FormField label="Subtitle" id="subtitle" value={formData.subtitle} onChange={handleChange} placeholder="e.g. Deep Learning, AI Assistant" />
          <FormField label="Project Link" id="link" value={formData.link} onChange={handleChange} placeholder="e.g. https://github.com/..." />
          <FormField label="Image Path" id="image_path" value={formData.image_path} onChange={handleChange} placeholder="e.g. /thumb1.png or /uploads/image.png" helpText="You can use /thumb1.png, /thumb2.png, /thumb3.png or paths from the media library." />
          
          <FormField 
            label="Featured Status" 
            id="featured" 
            type="toggle" 
            value={formData.featured} 
            onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.value }))}
            helpText="Highlight this project in featured slides" 
          />

          <FormField label="Position Order" id="position_order" type="number" value={formData.position_order} onChange={handleChange} helpText="Sorting index (0 is first)" />
          <FormField label="Technologies (Comma-separated)" id="technologiesText" value={formData.technologiesText} onChange={handleChange} placeholder="Python, PyTorch, React" />
          <FormField label="Description" id="description" type="textarea" rows={4} value={formData.description} onChange={handleChange} placeholder="Brief summary of what this project accomplished..." />

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
              {loading ? 'Saving...' : 'Save Project'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectsPage;
