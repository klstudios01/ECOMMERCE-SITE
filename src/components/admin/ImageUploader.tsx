'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, Check } from 'lucide-react';

interface Props {
  value: string;
  onChange: (url: string) => void;
}

export function ImageUploader({ value, onChange }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPEG, PNG, WEBP)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onChange(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-3">
      {value ? (
        <div className="relative rounded-lg overflow-hidden bg-slate-950 border border-slate-800 p-2 flex items-center gap-3">
          <img src={value} alt="Uploaded preview" className="w-16 h-16 object-cover rounded bg-slate-900" />
          <div className="flex-1 min-w-0">
            <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Image Ready
            </span>
            <p className="text-[10px] text-slate-400 truncate">{value.slice(0, 40)}...</p>
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-1 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-gold-500 bg-gold-500/10'
              : 'border-slate-800 hover:border-slate-700 bg-slate-950/60'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
            }}
          />
          <UploadCloud className="w-8 h-8 mx-auto text-gold-500 mb-2" />
          <p className="text-xs font-semibold text-white">Click or drag image file here to upload</p>
          <p className="text-[10px] text-slate-500 mt-1">PNG, JPG, WEBP up to 5MB</p>
        </div>
      )}

      {/* Manual URL Input */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-slate-500 uppercase font-semibold">Or URL:</span>
        <input
          type="text"
          placeholder="https://..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-slate-950 border border-slate-800 rounded py-1 px-2 text-[11px] text-white focus:outline-none focus:border-gold-500"
        />
      </div>
    </div>
  );
}
