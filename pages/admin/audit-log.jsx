import React from 'react';
import useSWR from 'swr';
import DataTable from '../../components/admin/DataTable';

const AuditLogPage = () => {
  const { data: logs } = useSWR('/api/audit-log');

  const columns = [
    { key: 'timestamp', label: 'Timestamp', render: (val) => val ? new Date(val).toLocaleString() : '' },
    { key: 'admin_email', label: 'Admin User', render: (val) => val || 'System/Seed' },
    { 
      key: 'action', 
      label: 'Action Taken', 
      render: (val) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-300">
          {val}
        </span>
      )
    },
    { key: 'target_table', label: 'Affected Table' },
    { key: 'target_id', label: 'Target ID', render: (val) => val || '-' },
    { 
      key: 'details', 
      label: 'Details', 
      render: (val) => val ? (
        <pre className="text-[10px] font-mono text-zinc-400 max-w-[250px] truncate overflow-x-auto" title={val}>
          {val}
        </pre>
      ) : '-'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex items-center justify-between">
        <h2 className="text-md font-bold text-zinc-350 uppercase tracking-wider">System Audit Logs</h2>
      </div>

      <DataTable
        columns={columns}
        data={logs || []}
      />
    </div>
  );
};

export default AuditLogPage;
