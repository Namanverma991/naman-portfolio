import React, { useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import FormField from '../../components/admin/FormField';
import Toast from '../../components/admin/Toast';

const SkillsPage = () => {
  const { data: skills } = useSWR('/api/content/skills');
  const [formState, setFormState] = useState({ languagesText: '', librariesText: '', toolsText: '', softSkillsText: '' });
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (skills) {
      setFormState({
        languagesText: skills.languages ? skills.languages.join(', ') : '',
        librariesText: skills.libraries ? skills.libraries.join(', ') : '',
        toolsText: skills.tools ? skills.tools.join(', ') : '',
        softSkillsText: skills.softSkills ? skills.softSkills.join(', ') : '',
      });
    }
  }, [skills]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormState(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      languages: formState.languagesText.split(',').map(s => s.trim()).filter(s => s !== ''),
      libraries: formState.librariesText.split(',').map(s => s.trim()).filter(s => s !== ''),
      tools: formState.toolsText.split(',').map(s => s.trim()).filter(s => s !== ''),
      softSkills: formState.softSkillsText.split(',').map(s => s.trim()).filter(s => s !== ''),
    };

    try {
      const res = await fetch('/api/content/skills', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        mutate('/api/content/skills');
        setToast({ message: 'Skills matrix updated successfully!', type: 'success' });
      } else {
        setToast({ message: 'Failed to update skills matrix', type: 'error' });
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
        <h2 className="text-md font-bold text-zinc-350 uppercase tracking-wider mb-6">Skills matrix (Comma-separated)</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField 
            label="Programming Languages" 
            id="languagesText" 
            value={formState.languagesText} 
            onChange={handleChange} 
            placeholder="Python, SQL, JavaScript" 
            helpText="E.g. Python, SQL, JavaScript, HTML, CSS"
          />
          <FormField 
            label="Libraries & Databases" 
            id="librariesText" 
            value={formState.librariesText} 
            onChange={handleChange} 
            placeholder="Pandas, NumPy, React, MongoDB" 
            helpText="E.g. Pandas, NumPy, FastAPI, ReactJs, MongoDB"
          />
          <FormField 
            label="Tools & Platforms" 
            id="toolsText" 
            value={formState.toolsText} 
            onChange={handleChange} 
            placeholder="Git, Jenkins, Power BI" 
            helpText="E.g. Git, GitHub, Power BI, Tableau, Jenkins"
          />
          <FormField 
            label="Professional & Soft Skills" 
            id="softSkillsText" 
            value={formState.softSkillsText} 
            onChange={handleChange} 
            placeholder="Problem Solving, Communication" 
            helpText="E.g. Communication, Problem Solving, Team Management"
          />

          <div className="flex justify-end pt-4 border-t border-zinc-800">
            <button
              type="submit"
              disabled={saving}
              className="bg-accent hover:opacity-90 active:scale-[0.98] text-white font-semibold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-accent/20 text-xs uppercase tracking-wider disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Skills Matrix'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SkillsPage;
