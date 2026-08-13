'use client';

import React, { useState, useRef } from 'react';
import { useThemeConfig } from '@/context/ThemeConfigContext';
import { useAuth } from '@/context/AuthContext';
import { ImageUploader } from './ImageUploader';
import {
  Code2,
  Palette,
  Type,
  Phone,
  FileText,
  Sliders,
  CreditCard,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Lock,
  Globe,
  Sparkles,
} from 'lucide-react';

export function DeveloperPortalClient() {
  const { config, updateConfig, resetConfig, exportConfigJSON, importConfigJSON } = useThemeConfig();
  const { devPasscode, changeDeveloperPasscode } = useAuth();

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'brand' | 'texts' | 'toggles' | 'gateway' | 'passcode' | 'json'>('brand');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Developer Passcode State
  const [currentDevPass, setCurrentDevPass] = useState('');
  const [newDevPass, setNewDevPass] = useState('');
  const [confirmDevPass, setConfirmDevPass] = useState('');
  const [passcodeMsg, setPasscodeMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeMsg(null);

    if (newDevPass !== confirmDevPass) {
      setPasscodeMsg({ type: 'error', text: 'New passcode key and confirmation passcode do not match.' });
      return;
    }

    const res = changeDeveloperPasscode(currentDevPass, newDevPass);

    if (res.success) {
      setPasscodeMsg({ type: 'success', text: res.message });
      setCurrentDevPass('');
      setNewDevPass('');
      setConfirmDevPass('');
    } else {
      setPasscodeMsg({ type: 'error', text: res.message });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const success = importConfigJSON(text);
        if (success) {
          alert('Site theme configuration imported successfully!');
        } else {
          alert('Failed to import configuration: Invalid JSON format');
        }
      };
      reader.readAsText(file);
    }
  };

  const PRESET_COLORS = [
    { name: 'Amber Gold', hex: '#F59E0B' },
    { name: 'Emerald Green', hex: '#10B981' },
    { name: 'Sapphire Blue', hex: '#3B82F6' },
    { name: 'Ruby Red', hex: '#EF4444' },
    { name: 'Amethyst Purple', hex: '#8B5CF6' },
  ];

  return (
    <div className="space-y-8">
      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Developer changes saved & applied live across the entire website!</span>
        </div>
      )}

      {/* Developer Control Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4">
        <button
          onClick={() => setActiveTab('brand')}
          className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-lg transition-colors ${
            activeTab === 'brand' ? 'bg-gold-500 text-slate-950' : 'bg-slate-900 text-slate-300 hover:text-white'
          }`}
        >
          <Palette className="w-4 h-4" /> Brand System & Palette
        </button>

        <button
          onClick={() => setActiveTab('texts')}
          className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-lg transition-colors ${
            activeTab === 'texts' ? 'bg-gold-500 text-slate-950' : 'bg-slate-900 text-slate-300 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" /> Global Copy & Texts
        </button>

        <button
          onClick={() => setActiveTab('toggles')}
          className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-lg transition-colors ${
            activeTab === 'toggles' ? 'bg-gold-500 text-slate-950' : 'bg-slate-900 text-slate-300 hover:text-white'
          }`}
        >
          <Sliders className="w-4 h-4" /> Feature Toggles
        </button>

        <button
          onClick={() => setActiveTab('gateway')}
          className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-lg transition-colors ${
            activeTab === 'gateway' ? 'bg-gold-500 text-slate-950' : 'bg-slate-900 text-slate-300 hover:text-white'
          }`}
        >
          <CreditCard className="w-4 h-4" /> Payment Gateway & APIs
        </button>

        <button
          onClick={() => setActiveTab('passcode')}
          className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-lg transition-colors ${
            activeTab === 'passcode' ? 'bg-gold-500 text-slate-950' : 'bg-slate-900 text-slate-300 hover:text-white'
          }`}
        >
          <Lock className="w-4 h-4" /> Developer Security Key
        </button>

        <button
          onClick={() => setActiveTab('json')}
          className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-lg transition-colors ${
            activeTab === 'json' ? 'bg-gold-500 text-slate-950' : 'bg-slate-900 text-slate-300 hover:text-white'
          }`}
        >
          <Code2 className="w-4 h-4" /> JSON Backup & Restore
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* BRAND SYSTEM TAB */}
        {activeTab === 'brand' && (
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Palette className="w-4 h-4 text-gold-500" /> Brand Identity & Aesthetics
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div>
                <label className="font-semibold text-slate-300">Store Brand Name *</label>
                <input
                  type="text"
                  required
                  value={config.storeName}
                  onChange={(e) => updateConfig({ storeName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded py-2 px-3 text-white focus:outline-none focus:border-gold-500 mt-1"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300">Logo Mode</label>
                <select
                  value={config.logoType}
                  onChange={(e) => updateConfig({ logoType: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded py-2 px-3 text-white focus:outline-none focus:border-gold-500 mt-1 font-bold text-gold-400"
                >
                  <option value="text">Text & Icon Logo</option>
                  <option value="image">Custom Image Logo URL</option>
                </select>
              </div>

              {config.logoType === 'text' ? (
                <div>
                  <label className="font-semibold text-slate-300">Logo Display Text *</label>
                  <input
                    type="text"
                    required
                    value={config.logoText}
                    onChange={(e) => updateConfig({ logoText: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded py-2 px-3 text-white focus:outline-none focus:border-gold-500 mt-1"
                  />
                </div>
              ) : (
                <div>
                  <label className="font-semibold text-slate-300 mb-1 block">Logo Image File / URL</label>
                  <ImageUploader
                    value={config.logoImageUrl}
                    onChange={(url) => updateConfig({ logoImageUrl: url })}
                  />
                </div>
              )}

              <div>
                <label className="font-semibold text-slate-300">Typography Font Family</label>
                <select
                  value={config.fontFamily}
                  onChange={(e) => updateConfig({ fontFamily: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded py-2 px-3 text-white focus:outline-none focus:border-gold-500 mt-1"
                >
                  <option value="Inter">Inter (Clean Modern Sans-Serif)</option>
                  <option value="Outfit">Outfit (Luxury Display Geometric)</option>
                  <option value="Roboto">Roboto (Technical Clean)</option>
                  <option value="Cinzel">Cinzel (High-End Luxury Serif)</option>
                </select>
              </div>

              {/* Color Presets */}
              <div className="sm:col-span-2 space-y-2 pt-2 border-t border-slate-800">
                <label className="font-semibold text-slate-300">Primary Color Token Palette</label>
                <div className="flex flex-wrap gap-3">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color.hex}
                      type="button"
                      onClick={() => updateConfig({ primaryColor: color.hex, accentColor: color.hex })}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${
                        config.primaryColor === color.hex
                          ? 'border-white bg-slate-950 text-white ring-2 ring-white/20'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: color.hex }} />
                      <span>{color.name} ({color.hex})</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* GLOBAL COPY & TEXTS TAB */}
        {activeTab === 'texts' && (
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-gold-500" /> Global Copy & Marketing Texts
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-300">Top Header Announcement Bar Text</label>
                <input
                  type="text"
                  value={config.topAnnouncementText}
                  onChange={(e) => updateConfig({ topAnnouncementText: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded py-2 px-3 text-white focus:outline-none focus:border-gold-500 mt-1"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300">Hero Heading Line 1</label>
                <input
                  type="text"
                  value={config.heroHeadingLine1}
                  onChange={(e) => updateConfig({ heroHeadingLine1: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded py-2 px-3 text-white focus:outline-none focus:border-gold-500 mt-1"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300">Hero Heading Line 2 (Highlighted Gradient)</label>
                <input
                  type="text"
                  value={config.heroHeadingLine2}
                  onChange={(e) => updateConfig({ heroHeadingLine2: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded py-2 px-3 text-white focus:outline-none focus:border-gold-500 mt-1"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-300">Hero Subtitle</label>
                <textarea
                  rows={2}
                  value={config.heroSubtitle}
                  onChange={(e) => updateConfig({ heroSubtitle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded py-2 px-3 text-white focus:outline-none focus:border-gold-500 mt-1"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300">Concierge Support Phone</label>
                <input
                  type="text"
                  value={config.supportPhone}
                  onChange={(e) => updateConfig({ supportPhone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded py-2 px-3 text-white focus:outline-none focus:border-gold-500 mt-1"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300">Concierge Support Email</label>
                <input
                  type="email"
                  value={config.supportEmail}
                  onChange={(e) => updateConfig({ supportEmail: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded py-2 px-3 text-white focus:outline-none focus:border-gold-500 mt-1"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-300">Flagship Gallery Physical Address</label>
                <input
                  type="text"
                  value={config.storeAddress}
                  onChange={(e) => updateConfig({ storeAddress: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded py-2 px-3 text-white focus:outline-none focus:border-gold-500 mt-1"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-300">Footer Copyright Text</label>
                <input
                  type="text"
                  value={config.footerCopyrightText}
                  onChange={(e) => updateConfig({ footerCopyrightText: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded py-2 px-3 text-white focus:outline-none focus:border-gold-500 mt-1"
                />
              </div>
            </div>
          </div>
        )}

        {/* FEATURE TOGGLES TAB */}
        {activeTab === 'toggles' && (
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-gold-500" /> Developer Feature Switches
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <label className="flex items-center justify-between p-4 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                <div>
                  <h4 className="font-bold text-white">Enable Top Announcement Bar</h4>
                  <p className="text-[11px] text-slate-400">Shows/hides free shipping announcement bar at top</p>
                </div>
                <input
                  type="checkbox"
                  checked={config.enableFreeShippingBanner}
                  onChange={(e) => updateConfig({ enableFreeShippingBanner: e.target.checked })}
                  className="w-4 h-4 accent-gold-500"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                <div>
                  <h4 className="font-bold text-white">Enable Customer Wishlist</h4>
                  <p className="text-[11px] text-slate-400">Shows/hides heart icon and wishlist functionality</p>
                </div>
                <input
                  type="checkbox"
                  checked={config.enableWishlist}
                  onChange={(e) => updateConfig({ enableWishlist: e.target.checked })}
                  className="w-4 h-4 accent-gold-500"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                <div>
                  <h4 className="font-bold text-white">Enable Quick View Modal</h4>
                  <p className="text-[11px] text-slate-400">Enables product quick view popups on catalog cards</p>
                </div>
                <input
                  type="checkbox"
                  checked={config.enableQuickView}
                  onChange={(e) => updateConfig({ enableQuickView: e.target.checked })}
                  className="w-4 h-4 accent-gold-500"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                <div>
                  <h4 className="font-bold text-white">Enable Client Reviews</h4>
                  <p className="text-[11px] text-slate-400">Allows customer review submissions on product pages</p>
                </div>
                <input
                  type="checkbox"
                  checked={config.enableReviews}
                  onChange={(e) => updateConfig({ enableReviews: e.target.checked })}
                  className="w-4 h-4 accent-gold-500"
                />
              </label>
            </div>
          </div>
        )}

        {/* PAYMENT GATEWAY TAB */}
        {activeTab === 'gateway' && (
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-gold-500" /> Paystack & System Integration
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div>
                <label className="font-semibold text-slate-300">Paystack Operational Mode</label>
                <select
                  value={config.paystackMode}
                  onChange={(e) => updateConfig({ paystackMode: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded py-2 px-3 text-white focus:outline-none focus:border-gold-500 mt-1 font-bold text-gold-400"
                >
                  <option value="demo">Test / Demo Mode (Sandbox Initializations)</option>
                  <option value="live">Live Production Mode (Real Gateway)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-300">Paystack Public Key</label>
                <input
                  type="text"
                  value={config.paystackPublicKey}
                  onChange={(e) => updateConfig({ paystackPublicKey: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded py-2 px-3 text-white font-mono text-[11px] focus:outline-none focus:border-gold-500 mt-1"
                />
              </div>
            </div>
          </div>
        )}

        {/* DEVELOPER PASSCODE TAB */}
        {activeTab === 'passcode' && (
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Lock className="w-4 h-4 text-gold-500" /> Update Developer Security Passcode Key
              </h3>
              <p className="text-xs text-slate-400 mt-1">Change the passcode key required to enter the Developer Portal.</p>
            </div>

            {passcodeMsg && (
              <div className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
                passcodeMsg.type === 'success' ? 'bg-emerald-950 border-emerald-800 text-emerald-300' : 'bg-rose-950/80 border-rose-800 text-rose-300'
              }`}>
                {passcodeMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                <span>{passcodeMsg.text}</span>
              </div>
            )}

            <div className="space-y-4 max-w-md text-xs">
              <div>
                <label className="font-semibold text-slate-300">Current Developer Passcode *</label>
                <input
                  type="password"
                  required
                  placeholder="dev12345"
                  value={currentDevPass}
                  onChange={(e) => setCurrentDevPass(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-3 text-white font-mono focus:outline-none focus:border-gold-500 mt-1"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300">New Developer Security Passcode *</label>
                <input
                  type="password"
                  required
                  placeholder="•••••••• (Min 6 characters)"
                  value={newDevPass}
                  onChange={(e) => setNewDevPass(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-3 text-white font-mono focus:outline-none focus:border-gold-500 mt-1"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300">Confirm New Security Passcode *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmDevPass}
                  onChange={(e) => setConfirmDevPass(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-3 text-white font-mono focus:outline-none focus:border-gold-500 mt-1"
                />
              </div>

              <button
                type="button"
                onClick={handlePasscodeSubmit}
                className="bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold text-xs px-6 py-3 rounded-lg transition-colors"
              >
                Update Developer Security Passcode
              </button>
            </div>
          </div>
        )}

        {/* JSON BACKUP & RESTORE TAB */}
        {activeTab === 'json' && (
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Code2 className="w-4 h-4 text-gold-500" /> Complete Developer JSON Backup
            </h3>

            <p className="text-xs text-slate-400">
              Export your entire developer site config, brand palette, and texts as a single `.json` file, or import a pre-configured theme configuration file.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                type="button"
                onClick={exportConfigJSON}
                className="bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Export Config JSON File
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-5 py-2.5 rounded-lg border border-slate-700 transition-colors flex items-center gap-2"
              >
                <Upload className="w-4 h-4" /> Import Config JSON File
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                className="hidden"
                onChange={handleFileImport}
              />

              <button
                type="button"
                onClick={() => {
                  if (confirm('Reset developer configuration to factory defaults?')) {
                    resetConfig();
                  }
                }}
                className="bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 font-semibold text-xs px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 ml-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Factory Reset
              </button>
            </div>
          </div>
        )}

        {/* Save Bar */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex justify-end gap-3">
          <button
            type="submit"
            className="bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold text-xs px-8 py-3 rounded-lg transition-colors flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> Save & Apply Developer Config
          </button>
        </div>
      </form>
    </div>
  );
}
