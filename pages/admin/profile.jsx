import React, { useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import FormField from '../../components/admin/FormField';
import Toast from '../../components/admin/Toast';

const ProfilePage = () => {
  const { data: personal } = useSWR('/api/content/personal');
  const { data: stats } = useSWR('/api/content/stats');

  const [personalForm, setPersonalForm] = useState({});
  const [statsForm, setStatsForm] = useState({});
  const [toast, setToast] = useState(null);
  const [savingPersonal, setSavingPersonal] = useState(false);
  const [savingStats, setSavingStats] = useState(false);

  useEffect(() => {
    if (personal) setPersonalForm(personal);
  }, [personal]);

  useEffect(() => {
    if (stats) setStatsForm(stats);
  }, [stats]);

  const handlePersonalChange = (e) => {
    const { id, value } = e.target;
    setPersonalForm(prev => ({ ...prev, [id]: value }));
  };

  const handleStatsChange = (e) => {
    const { id, value } = e.target;
    setStatsForm(prev => ({ ...prev, [id]: value }));
  };

  const handlePersonalSubmit = async (e) => {
    e.preventDefault();
    setSavingPersonal(true);
    try {
      const res = await fetch('/api/content/personal', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(personalForm)
      });
      if (res.ok) {
        mutate('/api/content/personal');
        setToast({ message: 'Profile details updated successfully!', type: 'success' });
      } else {
        setToast({ message: 'Failed to update profile details', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'An error occurred. Please try again.', type: 'error' });
    } finally {
      setSavingPersonal(false);
    }
  };

  const handleStatsSubmit = async (e) => {
    e.preventDefault();
    setSavingStats(true);
    try {
      const res = await fetch('/api/content/stats', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(statsForm)
      });
      if (res.ok) {
        mutate('/api/content/stats');
        setToast({ message: 'Stats counters updated successfully!', type: 'success' });
      } else {
        setToast({ message: 'Failed to update stats counters', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'An error occurred. Please try again.', type: 'error' });
    } finally {
      setSavingStats(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl">
            <h2 className="text-md font-bold text-zinc-300 uppercase tracking-wider mb-6">Personal details</h2>
            <form onSubmit={handlePersonalSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="First Name" id="firstName" value={personalForm.firstName} onChange={handlePersonalChange} required />
                <FormField label="Last Name" id="lastName" value={personalForm.lastName} onChange={handlePersonalChange} required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Full Name" id="name" value={personalForm.name} onChange={handlePersonalChange} required />
                <FormField label="Job Title / Specialty" id="title" value={personalForm.title} onChange={handlePersonalChange} required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Email" id="email" type="email" value={personalForm.email} onChange={handlePersonalChange} required />
                <FormField label="Phone" id="phone" value={personalForm.phone} onChange={handlePersonalChange} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="LinkedIn Profile" id="linkedin" value={personalForm.linkedin} onChange={handlePersonalChange} />
                <FormField label="GitHub Profile" id="github" value={personalForm.github} onChange={handlePersonalChange} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Location" id="location" value={personalForm.location} onChange={handlePersonalChange} />
                <FormField label="Portfolio Link" id="portfolio" value={personalForm.portfolio} onChange={handlePersonalChange} />
              </div>
              <div className="border-t border-zinc-800 my-6 pt-6" />
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Hero Section Text</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Hero Heading Line 1" id="heroHeadingLine1" value={personalForm.heroHeadingLine1} onChange={handlePersonalChange} />
                <FormField label="Hero Heading Accent" id="heroHeadingAccent" value={personalForm.heroHeadingAccent} onChange={handlePersonalChange} />
              </div>
              <FormField label="Hero Subtitle" id="heroSubtitle" type="textarea" rows={3} value={personalForm.heroSubtitle} onChange={handlePersonalChange} />
              <div className="border-t border-zinc-800 my-6 pt-6" />
              <FormField label="Professional Bio / Summary" id="summary" type="textarea" rows={5} value={personalForm.summary} onChange={handlePersonalChange} />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={savingPersonal}
                  className="bg-accent hover:opacity-90 active:scale-[0.98] text-white font-semibold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-accent/20 hover:shadow-accent/30 text-xs uppercase tracking-wider disabled:opacity-50"
                >
                  {savingPersonal ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Stats Form */}
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl">
            <h2 className="text-md font-bold text-zinc-300 uppercase tracking-wider mb-6">Stats & Counters</h2>
            <form onSubmit={handleStatsSubmit} className="space-y-4">
              <FormField label="Currently Status" id="currently" value={statsForm.currently} onChange={handleStatsChange} />
              <FormField label="Years of Experience" id="yearsExperience" value={statsForm.yearsExperience} onChange={handleStatsChange} />
              <FormField label="Projects Counter" id="projects" value={statsForm.projects} onChange={handleStatsChange} helpText="e.g. 10+ or 15" />
              <FormField label="Certifications Counter" id="certifications" value={statsForm.certifications} onChange={handleStatsChange} helpText="e.g. 10+ or 5" />
              <FormField label="Hackathons Won" id="hackathons" value={statsForm.hackathons} onChange={handleStatsChange} />
              <FormField label="Internships Completed" id="internships" value={statsForm.internships} onChange={handleStatsChange} />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={savingStats}
                  className="bg-accent hover:opacity-90 active:scale-[0.98] text-white font-semibold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-accent/20 hover:shadow-accent/30 text-xs uppercase tracking-wider disabled:opacity-50"
                >
                  {savingStats ? 'Saving...' : 'Save Counters'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
