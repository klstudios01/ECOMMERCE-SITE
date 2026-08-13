'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSent(true);
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
      setTimeout(() => setSent(false), 5000);
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-16 space-y-12">
      <div className="text-center space-y-2">
        <span className="text-gold-500 font-bold text-xs tracking-widest uppercase">Client Concierge</span>
        <h1 className="text-4xl font-black text-white uppercase">Contact & Gallery Support</h1>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Have a question about acoustic specs, custom engravings, or door delivery? We are at your service.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Direct Concierge</h3>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white">Flagship Gallery</h4>
                  <p className="text-slate-400">Oxford Street, Osu, Accra, Ghana</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white">Phone & WhatsApp</h4>
                  <p className="text-slate-400">+233 24 000 9999</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white">Support Email</h4>
                  <p className="text-slate-400">concierge@klstudios.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="md:col-span-2 p-8 rounded-xl bg-slate-900 border border-slate-800 space-y-6">
          <h3 className="text-lg font-bold text-white">Send Us a Direct Message</h3>

          {sent && (
            <div className="p-4 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Thank you! Your message has been received securely by our concierge.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Subject *</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300">Message Content *</label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold text-xs px-8 py-3.5 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {submitting ? 'Sending Message...' : <><Send className="w-4 h-4" /> Send Direct Message</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
