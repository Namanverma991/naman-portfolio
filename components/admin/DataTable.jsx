import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const DataTable = ({ columns, data, onEdit, onDelete, actions }) => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 font-semibold text-xs uppercase tracking-wider">
              {columns.map((col) => (
                <th key={col.key} className="px-6 py-4 font-semibold">
                  {col.label}
                </th>
              ))}
              {(onEdit || onDelete || actions) && (
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              )}
            </tr>
          </thead>
          
          <tbody className="divide-y divide-zinc-800 text-zinc-300 text-sm">
            {data && data.length > 0 ? (
              data.map((row, idx) => (
                <tr key={row.id || idx} className="hover:bg-zinc-850/30 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                  
                  {(onEdit || onDelete || actions) && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {actions && actions(row)}
                        
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-all text-xs"
                            title="Edit Item"
                          >
                            <FaEdit />
                          </button>
                        )}
                        
                        {onDelete && (
                          <button
                            onClick={() => onDelete(row)}
                            className="p-1.5 rounded-lg bg-zinc-800 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all text-xs"
                            title="Delete Item"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td 
                  colSpan={columns.length + (onEdit || onDelete || actions ? 1 : 0)} 
                  className="px-6 py-12 text-center text-zinc-500 font-medium"
                >
                  No items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
