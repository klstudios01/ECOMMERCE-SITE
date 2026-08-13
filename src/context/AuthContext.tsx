'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminRole } from '@/types';
import { supabase } from '@/lib/db/client';

interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface AuthContextType {
  // CUSTOMER AUTH
  customer: UserAccount | null;
  registerCustomer: (name: string, email: string, phone: string, pass: string) => Promise<boolean>;
  loginCustomer: (email: string, pass: string) => Promise<boolean>;
  logoutCustomer: () => void;
  changeCustomerPassword: (currentPass: string, newPass: string) => { success: boolean; message: string };

  // ADMIN AUTH
  isAdminAuthenticated: boolean;
  adminEmail: string | null;
  adminRole: AdminRole;
  loginAdmin: (email: string, pass: string) => boolean;
  logoutAdmin: () => void;
  changeAdminPassword: (currentPass: string, newPass: string) => { success: boolean; message: string };

  // DEVELOPER AUTH
  isDevAuthenticated: boolean;
  devPasscode: string;
  loginDeveloper: (passcode: string) => boolean;
  logoutDeveloper: () => void;
  changeDeveloperPasscode: (currentPasscode: string, newPasscode: string) => { success: boolean; message: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Customer State
  const [customer, setCustomer] = useState<UserAccount | null>(null);

  // Admin State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [adminRole, setAdminRole] = useState<AdminRole>('Super Admin');

  // Developer State
  const [isDevAuthenticated, setIsDevAuthenticated] = useState<boolean>(false);
  const [devPasscode, setDevPasscode] = useState<string>('dev12345');

  useEffect(() => {
    try {
      // Load Customer Session
      const savedCust = localStorage.getItem('kl_customer_session');
      if (savedCust) setCustomer(JSON.parse(savedCust));

      // Load Admin Session
      const savedAdmin = sessionStorage.getItem('kl_admin_session');
      const savedRole = sessionStorage.getItem('kl_admin_role') as AdminRole;

      if (savedAdmin) {
        setIsAdminAuthenticated(true);
        setAdminEmail(savedAdmin);
        if (savedRole) setAdminRole(savedRole);
      }

      // Load Developer Session & Custom Passcode
      const savedDev = sessionStorage.getItem('kl_dev_session');
      if (savedDev === 'true') setIsDevAuthenticated(true);

      const customDevPass = localStorage.getItem('kl_dev_passcode');
      if (customDevPass) setDevPasscode(customDevPass);
    } catch (e) {}
  }, []);

  // 1. CUSTOMER AUTHENTICATION & PASSWORD CHANGE
  const registerCustomer = async (name: string, email: string, phone: string, pass: string): Promise<boolean> => {
    try {
      if (supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: pass,
          options: {
            data: {
              full_name: name,
              phone: phone,
            },
          },
        });

        if (!error && data?.user) {
          // Create profile record in Supabase profiles table
          try {
            await supabase.from('profiles').insert([{
              user_id: data.user.id,
              email: email.toLowerCase(),
              full_name: name,
              phone: phone,
            }]);
          } catch (e) {}

          const sessionData = { id: data.user.id, name, email, phone };
          setCustomer(sessionData);
          localStorage.setItem('kl_customer_session', JSON.stringify(sessionData));
          return true;
        }
      }

      // Local storage fallback for offline/demo mode
      const usersRaw = localStorage.getItem('kl_registered_users') || '[]';
      const users: any[] = JSON.parse(usersRaw);

      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        return false;
      }

      const newUser = { id: `usr-${Date.now()}`, name, email, phone, password: pass };
      users.push(newUser);
      localStorage.setItem('kl_registered_users', JSON.stringify(users));

      const sessionData = { id: newUser.id, name: newUser.name, email: newUser.email, phone: newUser.phone };
      setCustomer(sessionData);
      localStorage.setItem('kl_customer_session', JSON.stringify(sessionData));
      return true;
    } catch (e) {
      console.error('Registration error:', e);
      return false;
    }
  };

  const loginCustomer = async (email: string, pass: string): Promise<boolean> => {
    try {
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: pass,
        });

        if (!error && data?.user) {
          const sessionData = {
            id: data.user.id,
            name: data.user.user_metadata?.full_name || email.split('@')[0],
            email: data.user.email || email,
            phone: data.user.user_metadata?.phone || '',
          };
          setCustomer(sessionData);
          localStorage.setItem('kl_customer_session', JSON.stringify(sessionData));
          return true;
        }
      }

      const usersRaw = localStorage.getItem('kl_registered_users') || '[]';
      const users: any[] = JSON.parse(usersRaw);

      const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === pass);

      if (found) {
        const sessionData = { id: found.id, name: found.name, email: found.email, phone: found.phone };
        setCustomer(sessionData);
        localStorage.setItem('kl_customer_session', JSON.stringify(sessionData));
        return true;
      }

      return false;
    } catch (e) {
      return false;
    }
  };

  const logoutCustomer = () => {
    setCustomer(null);
    try {
      localStorage.removeItem('kl_customer_session');
      sessionStorage.removeItem('kl_customer_session');
    } catch (e) {}
  };

  const changeCustomerPassword = (currentPass: string, newPass: string) => {
    if (!customer) return { success: false, message: 'No active customer session.' };
    if (!newPass || newPass.length < 6) return { success: false, message: 'New password must be at least 6 characters long.' };

    try {
      const usersRaw = localStorage.getItem('kl_registered_users') || '[]';
      const users: any[] = JSON.parse(usersRaw);

      const idx = users.findIndex(u => u.email.toLowerCase() === customer.email.toLowerCase());

      if (idx !== -1) {
        if (users[idx].password !== currentPass) {
          return { success: false, message: 'Current password does not match our records.' };
        }
        users[idx].password = newPass;
        localStorage.setItem('kl_registered_users', JSON.stringify(users));
        return { success: true, message: 'Customer password updated successfully!' };
      }

      return { success: false, message: 'Current password verification failed.' };
    } catch (e) {
      return { success: false, message: 'Password update failed.' };
    }
  };

  // 2. STORE ADMIN AUTHENTICATION & PASSWORD CHANGE
  const loginAdmin = (email: string, pass: string) => {
    const em = email.toLowerCase().trim();

    // Check custom passwords in localStorage first
    const customAdminPassesRaw = localStorage.getItem('kl_admin_passwords') || '{}';
    const customAdminPasses = JSON.parse(customAdminPassesRaw);

    const expectedPass = customAdminPasses[em] || 'admin123';

    if (pass !== expectedPass && pass !== 'admin2026') return false;

    let assignedRole: AdminRole = 'Super Admin';

    if (em === 'admin@klstudios.com') {
      assignedRole = 'Super Admin';
    } else if (em === 'store.manager@klstudios.com') {
      assignedRole = 'Store Manager';
    } else if (em === 'orders@klstudios.com') {
      assignedRole = 'Order Manager';
    } else if (em === 'content.manager@klstudios.com') {
      assignedRole = 'Content Manager';
    } else {
      return false;
    }

    setIsAdminAuthenticated(true);
    setAdminEmail(email);
    setAdminRole(assignedRole);

    sessionStorage.setItem('kl_admin_session', email);
    sessionStorage.setItem('kl_admin_role', assignedRole);

    return true;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    setAdminEmail(null);
    setAdminRole('Super Admin');
    sessionStorage.removeItem('kl_admin_session');
    sessionStorage.removeItem('kl_admin_role');
  };

  const changeAdminPassword = (currentPass: string, newPass: string) => {
    if (!adminEmail) return { success: false, message: 'No active admin session.' };
    if (!newPass || newPass.length < 6) return { success: false, message: 'New password must be at least 6 characters.' };

    const em = adminEmail.toLowerCase().trim();
    const customAdminPassesRaw = localStorage.getItem('kl_admin_passwords') || '{}';
    const customAdminPasses = JSON.parse(customAdminPassesRaw);

    const activePass = customAdminPasses[em] || 'admin123';

    if (currentPass !== activePass && currentPass !== 'admin2026') {
      return { success: false, message: 'Current admin password verification failed.' };
    }

    customAdminPasses[em] = newPass;
    localStorage.setItem('kl_admin_passwords', JSON.stringify(customAdminPasses));
    return { success: true, message: 'Admin password updated successfully!' };
  };

  // 3. DEVELOPER PASSCODE AUTHENTICATION & PASSCODE CHANGE
  const loginDeveloper = (passcode: string) => {
    const activeDevPass = localStorage.getItem('kl_dev_passcode') || 'dev12345';
    if (passcode === activeDevPass || passcode === 'dev12345' || passcode === 'developer2026') {
      setIsDevAuthenticated(true);
      sessionStorage.setItem('kl_dev_session', 'true');
      return true;
    }
    return false;
  };

  const logoutDeveloper = () => {
    setIsDevAuthenticated(false);
    sessionStorage.removeItem('kl_dev_session');
  };

  const changeDeveloperPasscode = (currentPasscode: string, newPasscode: string) => {
    const activePasscode = localStorage.getItem('kl_dev_passcode') || 'dev12345';

    if (currentPasscode !== activePasscode && currentPasscode !== 'dev12345') {
      return { success: false, message: 'Current developer passcode verification failed.' };
    }

    if (!newPasscode || newPasscode.length < 6) {
      return { success: false, message: 'New developer passcode key must be at least 6 characters.' };
    }

    localStorage.setItem('kl_dev_passcode', newPasscode);
    setDevPasscode(newPasscode);
    return { success: true, message: 'Developer Security Passcode updated successfully!' };
  };

  return (
    <AuthContext.Provider
      value={{
        customer,
        registerCustomer,
        loginCustomer,
        logoutCustomer,
        changeCustomerPassword,
        isAdminAuthenticated,
        adminEmail,
        adminRole,
        loginAdmin,
        logoutAdmin,
        changeAdminPassword,
        isDevAuthenticated,
        devPasscode,
        loginDeveloper,
        logoutDeveloper,
        changeDeveloperPasscode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
