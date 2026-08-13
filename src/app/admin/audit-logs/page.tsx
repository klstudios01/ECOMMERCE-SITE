import React from 'react';
import { dbService } from '@/lib/db/client';
import { Shield } from 'lucide-react';

export const revalidate = 0;

export default async function AdminAuditLogsPage() {
  const logs = await dbService.getAuditLogs();

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-800 pb-6">
        <span className="text-gold-500 font-bold text-xs tracking-widest uppercase">Security & Compliance</span>
        <h1 className="text-3xl font-black text-white uppercase">Administrative Audit Logs</h1>
      </div>

      <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Operator</th>
                <th className="p-4">Action</th>
                <th className="p-4">Resource</th>
                <th className="p-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-850/50">
                  <td className="p-4 text-slate-400">{new Date(log.created_at).toLocaleString()}</td>
                  <td className="p-4 font-bold text-white">{log.admin_email || 'System'}</td>
                  <td className="p-4 font-bold text-gold-400">{log.action}</td>
                  <td className="p-4 text-slate-300">{log.resource}</td>
                  <td className="p-4 font-mono text-[10px] text-slate-400">
                    {log.details ? JSON.stringify(log.details) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
