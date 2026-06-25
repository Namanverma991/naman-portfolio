import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import Toast from '../../components/admin/Toast';
import { FaCloudUploadAlt, FaCopy, FaTrash, FaCheck } from 'react-icons/fa';

const MediaPage = () => {
  const { data: media } = useSWR('/api/media/list');
  const [toast, setToast] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setToast({ message: 'Only image files are allowed.', type: 'error' });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        mutate('/api/media/list');
        setToast({ message: 'Image uploaded successfully!', type: 'success' });
      } else {
        setToast({ message: 'Failed to upload image.', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'An error occurred.', type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (item) => {
    if (confirm(`Are you sure you want to delete "${item.original_name}"?`)) {
      try {
        const res = await fetch(`/api/media/${item.id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          mutate('/api/media/list');
          setToast({ message: 'Image deleted successfully!', type: 'success' });
        } else {
          setToast({ message: 'Failed to delete image.', type: 'error' });
        }
      } catch (err) {
        setToast({ message: 'An error occurred.', type: 'error' });
      }
    }
  };

  const copyToClipboard = (item) => {
    navigator.clipboard.writeText(item.path);
    setCopiedId(item.id);
    setToast({ message: 'Image path copied to clipboard!', type: 'success' });
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between">
        <h2 className="text-md font-bold text-zinc-350 uppercase tracking-wider">Media Library</h2>
        <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-white font-semibold text-xs uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-accent/20 cursor-pointer">
          <FaCloudUploadAlt className="text-sm" /> 
          {uploading ? 'Uploading...' : 'Upload Image'}
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {media && media.length > 0 ? (
          media.map((item) => (
            <div key={item.id} className="group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden relative shadow-md hover:border-zinc-700 transition-all flex flex-col justify-between">
              <div className="aspect-square bg-zinc-950 flex items-center justify-center overflow-hidden relative border-b border-zinc-850">
                <img src={item.path} alt={item.original_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button 
                    onClick={() => copyToClipboard(item)}
                    className="p-2 rounded-xl bg-zinc-800 text-zinc-200 hover:text-white hover:bg-zinc-700 transition-all"
                    title="Copy Image Path"
                  >
                    {copiedId === item.id ? <FaCheck className="text-emerald-400" /> : <FaCopy />}
                  </button>
                  <button 
                    onClick={() => handleDelete(item)}
                    className="p-2 rounded-xl bg-rose-500/20 text-rose-400 hover:text-rose-350 hover:bg-rose-500/35 transition-all"
                    title="Delete Image"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              <div className="p-3 text-[10px] text-zinc-500 font-semibold truncate bg-zinc-950/40">
                {item.original_name}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 text-center text-zinc-500 font-medium">
            No images in the library. Upload some to use in projects.
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaPage;
