import React from 'react';
import { useRouter } from 'next/router';
import { AdminAuthProvider, useAdminAuth } from '../../lib/AdminAuthContext';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const AdminLayoutContent = ({ children }) => {
  const { user, loading } = useAdminAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-zinc-800 border-t-accent animate-spin" />
        <span className="text-zinc-500 text-xs font-semibold tracking-wider uppercase">Verifying Session...</span>
      </div>
    );
  }

  if (router.pathname === '/admin/login') {
    return <div className="min-h-screen bg-zinc-950 text-zinc-100">{children}</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex text-zinc-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

const AdminLayout = ({ children }) => {
  return (
    <AdminAuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminAuthProvider>
  );
};

export default AdminLayout;
