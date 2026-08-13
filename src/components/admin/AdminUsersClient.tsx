'use client';

import React, { useState } from 'react';
import { AdminRole } from '@/types';
import { ROLE_PERMISSIONS } from '@/lib/auth/rbac';
import { dbService } from '@/lib/db/client';
import { Shield, Plus, UserCheck, Lock, X, CheckCircle2 } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: 'Active' | 'Suspended';
}

export function AdminUsersClient() {
  const [team, setTeam] = useState<TeamMember[]>([
    { id: 'u1', name: 'Kwame Appiah', email: 'admin@klstudios.com', role: 'Super Admin', status: 'Active' },
    { id: 'u2', name: 'Abena Osei', email: 'store.manager@klstudios.com', role: 'Store Manager', status: 'Active' },
    { id: 'u3', name: 'Kojo Mensah', email: 'orders@klstudios.com', role: 'Order Manager', status: 'Active' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<AdminRole>('Store Manager');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const newMember: TeamMember = {
      id: `u-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      role,
      status: 'Active',
    };

    setTeam(prev => [...prev, newMember]);
    await dbService.logAdminAction('admin@klstudios.com', 'Admin User Invited', 'AdminUsers', {
      invited_email: email,
      assigned_role: role,
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsModalOpen(false);
      setName('');
      setEmail('');
    }, 1200);
  };

  const handleToggleStatus = async (id: string) => {
    setTeam(prev =>
      prev.map(m => {
        if (m.id === id) {
          const nextStatus = m.status === 'Active' ? 'Suspended' : 'Active';
          dbService.logAdminAction('admin@klstudios.com', `Admin ${nextStatus}`, 'AdminUsers', { target_id: id });
          return { ...m, status: nextStatus };
        }
        return m;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold">
          <Shield className="w-4 h-4 text-gold-500" /> Total Active Operators: <strong className="text-white">{team.length}</strong>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Invite Sub-Admin
        </button>
      </div>

      {/* Team Table */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Operator Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role Assignment</th>
                <th className="p-4">Granted Permissions</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {team.map((member) => (
                <tr key={member.id} className="hover:bg-slate-850/50">
                  <td className="p-4 font-bold text-white flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-gold-500" />
                    <span>{member.name}</span>
                  </td>
                  <td className="p-4 text-slate-300">{member.email}</td>
                  <td className="p-4 font-bold text-gold-400">{member.role}</td>
                  <td className="p-4 text-[10px] text-slate-400 max-w-xs truncate">
                    {ROLE_PERMISSIONS[member.role]?.join(', ')}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      member.status === 'Active' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleToggleStatus(member.id)}
                      className="text-xs font-semibold text-slate-400 hover:text-white underline"
                    >
                      {member.status === 'Active' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl overflow-hidden p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Invite Team Sub-Admin</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {savedSuccess && (
              <div className="p-3 rounded bg-emerald-950 text-emerald-300 text-xs flex items-center gap-2 border border-emerald-800">
                <CheckCircle2 className="w-4 h-4" /> Team invitation issued successfully!
              </div>
            )}

            <form onSubmit={handleInviteSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-300">Member Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ama Serwaa"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded py-2 px-3 text-white focus:outline-none focus:border-gold-500 mt-1"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300">Member Email *</label>
                <input
                  type="email"
                  required
                  placeholder="ama.serwaa@klstudios.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded py-2 px-3 text-white focus:outline-none focus:border-gold-500 mt-1"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300">Assign Role Privilege *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as AdminRole)}
                  className="w-full bg-slate-950 border border-slate-800 rounded py-2 px-3 text-white focus:outline-none focus:border-gold-500 mt-1 font-bold text-gold-400"
                >
                  <option value="Super Admin">Super Admin (Full Control)</option>
                  <option value="Store Manager">Store Manager (Products & Orders)</option>
                  <option value="Order Manager">Order Manager (Fulfillment & Delivery)</option>
                  <option value="Content Manager">Content Manager (Banners & CMS)</option>
                </select>
              </div>

              <div className="p-3 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <span className="font-bold text-white block">Role Capabilities:</span>
                <p>{ROLE_PERMISSIONS[role]?.join(', ')}</p>
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-800 text-slate-300 px-4 py-2 rounded font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold px-6 py-2 rounded transition-colors"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
