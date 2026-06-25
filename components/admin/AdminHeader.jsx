import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAdminAuth } from '../../lib/AdminAuthContext';
import { FaUserCircle, FaExternalLinkAlt } from 'react-icons/fa';

const AdminHeader = () => {
  const router = useRouter();
  const { user } = useAdminAuth();

  const getTitle = () => {
    const path = router.pathname;
    if (path === '/admin') return 'Dashboard';
    if (path.startsWith('/admin/profile')) return 'Profile Details';
    if (path.startsWith('/admin/experience')) return 'Work Experience';
    if (path.startsWith('/admin/projects')) return 'Projects';
    if (path.startsWith('/admin/skills')) return 'Skills Matrix';
    if (path.startsWith('/admin/education')) return 'Education History';
    if (path.startsWith('/admin/certifications')) return 'Certifications';
    if (path.startsWith('/admin/services')) return 'Services Config';
    if (path.startsWith('/admin/resume')) return 'Resume Files';
    if (path.startsWith('/admin/media')) return 'Media Uploads';
    if (path.startsWith('/admin/messages')) return 'Contact Inbox';
    if (path.startsWith('/admin/settings')) return 'Site Settings';
    if (path.startsWith('/admin/audit-log')) return 'System Audit Logs';
    return 'Admin';
  };

  return (
    <header className="h-16 border-b border-zinc-900 bg-zinc-950 flex items-center justify-between px-8 sticky top-0 z-40">
      <div>
        <h1 className="text-lg font-bold text-zinc-100">{getTitle()}</h1>
      </div>

      <div className="flex items-center gap-6">
        <Link 
          href="/" 
          target="_blank"
          className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-zinc-100 transition-colors uppercase tracking-wider"
        >
          View Site
          <FaExternalLinkAlt className="text-[10px]" />
        </Link>

        <div className="h-4 w-px bg-zinc-800" />

        <div className="flex items-center gap-2">
          <FaUserCircle className="text-zinc-400 text-xl" />
          <span className="text-sm font-medium text-zinc-300">{user?.email}</span>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
