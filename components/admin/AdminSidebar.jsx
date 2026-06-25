import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAdminAuth } from '../../lib/AdminAuthContext';
import { 
  FaHome, FaUser, FaBriefcase, FaLaptopCode, FaTools, 
  FaGraduationCap, FaAward, FaList, FaFilePdf, FaImage, 
  FaEnvelope, FaCog, FaHistory, FaSignOutAlt 
} from 'react-icons/fa';

const AdminSidebar = () => {
  const router = useRouter();
  const { logout } = useAdminAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: FaHome },
    { name: 'Profile Info', path: '/admin/profile', icon: FaUser },
    { name: 'Experience', path: '/admin/experience', icon: FaBriefcase },
    { name: 'Projects', path: '/admin/projects', icon: FaLaptopCode },
    { name: 'Skills', path: '/admin/skills', icon: FaList },
    { name: 'Education', path: '/admin/education', icon: FaGraduationCap },
    { name: 'Certifications', path: '/admin/certifications', icon: FaAward },
    { name: 'Services', path: '/admin/services', icon: FaTools },
    { name: 'Resume', path: '/admin/resume', icon: FaFilePdf },
    { name: 'Media Library', path: '/admin/media', icon: FaImage },
    { name: 'Messages', path: '/admin/messages', icon: FaEnvelope },
    { name: 'Settings', path: '/admin/settings', icon: FaCog },
    { name: 'Audit Log', path: '/admin/audit-log', icon: FaHistory },
  ];

  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-900 flex flex-col h-screen sticky top-0">
      {/* Sidebar Header */}
      <div className="h-16 flex items-center px-6 border-b border-zinc-900">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center font-bold text-white">A</div>
          <span className="font-bold text-zinc-100 tracking-wide">Admin CMS</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
        {menuItems.map((item) => {
          const isActive = router.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive 
                  ? 'bg-accent text-white shadow-lg shadow-accent/20' 
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50'
              }`}
            >
              <Icon className={`text-base ${isActive ? 'text-white' : 'text-zinc-500'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-zinc-900">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
        >
          <FaSignOutAlt className="text-base" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
