'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeConfig, DEFAULT_THEME_CONFIG } from '@/types/theme';

interface ThemeConfigContextType {
  config: ThemeConfig;
  updateConfig: (newConfig: Partial<ThemeConfig>) => void;
  resetConfig: () => void;
  exportConfigJSON: () => void;
  importConfigJSON: (jsonString: string) => boolean;
}

const ThemeConfigContext = createContext<ThemeConfigContextType | undefined>(undefined);

export function ThemeConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<ThemeConfig>(DEFAULT_THEME_CONFIG);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('kl_developer_theme_config');
      if (saved) {
        setConfig({ ...DEFAULT_THEME_CONFIG, ...JSON.parse(saved) });
      }
    } catch (e) {
      console.error('Failed to load theme config from localStorage:', e);
    }
  }, []);

  const updateConfig = (newConfig: Partial<ThemeConfig>) => {
    setConfig(prev => {
      const updated = { ...prev, ...newConfig };
      try {
        localStorage.setItem('kl_developer_theme_config', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save theme config:', e);
      }
      return updated;
    });
  };

  const resetConfig = () => {
    setConfig(DEFAULT_THEME_CONFIG);
    try {
      localStorage.removeItem('kl_developer_theme_config');
    } catch (e) {}
  };

  const exportConfigJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `kl_studios_theme_config_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importConfigJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      updateConfig(parsed);
      return true;
    } catch (e) {
      console.error('Invalid JSON theme config:', e);
      return false;
    }
  };

  return (
    <ThemeConfigContext.Provider
      value={{
        config,
        updateConfig,
        resetConfig,
        exportConfigJSON,
        importConfigJSON,
      }}
    >
      {children}
    </ThemeConfigContext.Provider>
  );
}

export function useThemeConfig() {
  const context = useContext(ThemeConfigContext);
  if (!context) {
    throw new Error('useThemeConfig must be used within ThemeConfigProvider');
  }
  return context;
}
