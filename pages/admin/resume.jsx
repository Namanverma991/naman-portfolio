import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import Toast from '../../components/admin/Toast';
import { FaCloudUploadAlt, FaFilePdf, FaEye, FaDownload } from 'react-icons/fa';
import StatCard from '../../components/admin/StatCard';

const ResumePage = () => {
  const { data: resume } = useSWR('/api/content/resume');
  const { data: analytics } = useSWR('/api/analytics/resume');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      setToast({ message: 'Please select a valid PDF file.', type: 'error' });
      setFile(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await fetch('/api/content/resume', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        mutate('/api/content/resume');
        mutate('/api/analytics/resume');
        setToast({ message: 'Resume uploaded and activated successfully!', type: 'success' });
        setFile(null);
      } else {
        const data = await res.json();
        setToast({ message: data.error || 'Failed to upload resume.', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'An error occurred during upload.', type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard title="Resume Downloads" value={analytics?.totalDownloads || 0} icon={FaDownload} description="Total PDF downloads" />
        <StatCard title="Resume Views" value={analytics?.totalViews || 0} icon={FaEye} description="Total views" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Panel */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between min-h-[300px]">
          <div>
            <h3 className="text-sm font-semibold text-zinc-450 uppercase tracking-wider mb-4">Upload New Resume</h3>
            <p className="text-zinc-550 text-xs mb-6">Replace your active portfolio resume. Uploaded file must be in PDF format. This will automatically update the public download file.</p>
          </div>

          <form onSubmit={handleUpload} className="space-y-4">
            <label className="flex flex-col items-center justify-center border-2 border-zinc-800 border-dashed rounded-2xl p-6 hover:bg-zinc-850/50 hover:border-accent transition-all cursor-pointer">
              <FaCloudUploadAlt className="text-3xl text-zinc-600 mb-2" />
              <span className="text-zinc-400 text-xs font-semibold">{file ? file.name : 'Select PDF File'}</span>
              <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
            </label>

            <button
              type="submit"
              disabled={!file || uploading}
              className="w-full bg-accent hover:opacity-90 active:scale-[0.98] text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-accent/20 text-xs uppercase tracking-wider disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {uploading ? 'Uploading...' : 'Activate Resume'}
            </button>
          </form>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl">
          <h3 className="text-sm font-semibold text-zinc-450 uppercase tracking-wider mb-4 flex items-center gap-2">
            <FaFilePdf className="text-accent" /> Active Resume Preview
          </h3>
          <div className="relative w-full h-[500px] bg-zinc-950 border border-zinc-850 rounded-xl overflow-hidden">
            {resume?.path ? (
              <iframe
                src={`${resume.path}#toolbar=0`}
                className="w-full h-full border-none"
                title="Active Resume"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-zinc-500 text-sm font-medium">
                No active resume file found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePage;
