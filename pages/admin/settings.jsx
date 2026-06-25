import React, { useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import FormField from '../../components/admin/FormField';
import Toast from '../../components/admin/Toast';

const SettingsPage = () => {
  const { data: settings } = useSWR('/api/settings');
  const [formState, setFormState] = useState({ siteTitle: '', metaDescription: '', metaKeywords: '', accentColor: '#f13024', gaTrackingId: '' });
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormState({
        siteTitle: settings.siteTitle || '',
        metaDescription: settings.metaDescription || '',
        metaKeywords: settings.metaKeywords || '',
        accentColor: settings.accentColor || '#f13024',
        gaTrackingId: settings.gaTrackingId || '',
      });
    }
  }, [settings]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormState(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState)
      });
      if (res.ok) {
        mutate('/api/settings');
        setToast({ message: 'Settings saved successfully!', type: 'success' });
      } else {
        setToast({ message: 'Failed to save settings.', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'An error occurred.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl max-w-3xl">
        <h2 className="text-md font-bold text-zinc-350 uppercase tracking-wider mb-6">Site Configurations</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField label="Site Browser Title" id="siteTitle" value={formState.siteTitle} onChange={handleChange} required placeholder="Naman Verma | Portfolio" />
          <FormField label="SEO Description" id="metaDescription" type="textarea" rows={3} value={formState.metaDescription} onChange={handleChange} placeholder="Naman Verma is a Data Science and Analytics student..." />
          <FormField label="SEO Keywords" id="metaKeywords" value={formState.metaKeywords} onChange={handleChange} placeholder="data science, portfolio, nextjs" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Accent Color Hex" id="accentColor" value={formState.accentColor} onChange={handleChange} placeholder="#f13024" helpText="Global color accent used for links and tabs" />
            <FormField label="Google Analytics Tracking ID" id="gaTrackingId" value={formState.gaTrackingId} onChange={handleChange} placeholder="G-XXXXXXXXXX" />
          </div>

          <div className="flex justify-end pt-4 border-t border-zinc-800">
            <button
              type="submit"
              disabled={saving}
              className="bg-accent hover:opacity-90 active:scale-[0.98] text-white font-semibold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-accent/20 text-xs uppercase tracking-wider disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
