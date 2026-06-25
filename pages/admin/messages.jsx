import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import Toast from '../../components/admin/Toast';
import { FaEnvelopeOpen, FaEnvelope, FaTrash, FaDownload, FaEye } from 'react-icons/fa';

const MessagesPage = () => {
  const { data: messages } = useSWR('/api/contact/list');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [toast, setToast] = useState(null);

  const handleOpen = async (msg) => {
    setSelectedMessage(msg);
    if (!msg.is_read) {
      try {
        await fetch(`/api/contact/${msg.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ is_read: true })
        });
        mutate('/api/contact/list');
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleClose = () => {
    setSelectedMessage(null);
  };

  const handleDelete = async (msg) => {
    if (confirm(`Are you sure you want to delete this message from "${msg.name}"?`)) {
      try {
        const res = await fetch(`/api/contact/${msg.id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          mutate('/api/contact/list');
          setToast({ message: 'Message deleted successfully!', type: 'success' });
          if (selectedMessage && selectedMessage.id === msg.id) {
            handleClose();
          }
        } else {
          setToast({ message: 'Failed to delete message', type: 'error' });
        }
      } catch (err) {
        setToast({ message: 'An error occurred.', type: 'error' });
      }
    }
  };

  const handleExport = () => {
    window.open('/api/contact/export', '_blank');
  };

  const columns = [
    { 
      key: 'is_read', 
      label: '', 
      render: (val) => val ? (
        <FaEnvelopeOpen className="text-zinc-500 text-sm" />
      ) : (
        <FaEnvelope className="text-accent text-sm" />
      )
    },
    { key: 'name', label: 'Sender Name' },
    { key: 'email', label: 'Sender Email' },
    { key: 'subject', label: 'Subject' },
    { key: 'created_at', label: 'Submitted Date', render: (val) => val ? new Date(val).toLocaleString() : '' }
  ];

  const customActions = (row) => (
    <button
      onClick={() => handleOpen(row)}
      className="p-1.5 rounded-lg bg-zinc-800 text-zinc-350 hover:text-white hover:bg-zinc-700 transition-all text-xs"
      title="View Message details"
    >
      <FaEye />
    </button>
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between">
        <h2 className="text-md font-bold text-zinc-350 uppercase tracking-wider">Messages Inbox</h2>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-semibold text-xs uppercase tracking-wider hover:text-white hover:bg-zinc-800 active:scale-95 transition-all shadow-lg"
        >
          <FaDownload /> Export CSV
        </button>
      </div>

      <DataTable
        columns={columns}
        data={messages?.items || []}
        onDelete={handleDelete}
        actions={customActions}
      />

      <Modal
        isOpen={!!selectedMessage}
        onClose={handleClose}
        title={selectedMessage?.subject || 'Message detail'}
      >
        {selectedMessage && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-zinc-400 border-b border-zinc-800 pb-4">
              <div>
                <span className="block uppercase text-[10px] text-zinc-500 mb-1">From</span>
                <span className="text-zinc-200">{selectedMessage.name}</span> &lt;{selectedMessage.email}&gt;
              </div>
              <div>
                <span className="block uppercase text-[10px] text-zinc-500 mb-1">Received At</span>
                <span className="text-zinc-200">{new Date(selectedMessage.created_at).toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="block uppercase text-[10px] text-zinc-500 font-bold">Message Content</span>
              <p className="text-zinc-300 text-sm whitespace-pre-wrap leading-relaxed bg-zinc-950 p-4 rounded-xl border border-zinc-900">
                {selectedMessage.message}
              </p>
            </div>

            <div className="flex justify-between pt-4 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => handleDelete(selectedMessage)}
                className="flex items-center gap-2 px-4 py-2 bg-rose-500/20 text-rose-400 hover:text-rose-350 hover:bg-rose-500/30 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                <FaTrash /> Delete Message
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MessagesPage;
