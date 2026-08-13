import { AdminRole } from '@/types';

export const ROLE_PERMISSIONS: Record<AdminRole, string[]> = {
  'Super Admin': [
    '/admin',
    '/admin/developer',
    '/admin/products',
    '/admin/orders',
    '/admin/inventory',
    '/admin/delivery',
    '/admin/coupons',
    '/admin/content',
    '/admin/users',
    '/admin/settings',
    '/admin/audit-logs',
  ],
  'Store Manager': [
    '/admin',
    '/admin/products',
    '/admin/inventory',
    '/admin/coupons',
    '/admin/content',
  ],
  'Order Manager': [
    '/admin',
    '/admin/orders',
    '/admin/delivery',
  ],
  'Content Manager': [
    '/admin',
    '/admin/content',
    '/admin/products',
  ],
};

export function isRouteAllowed(role: AdminRole, routePath: string): boolean {
  if (role === 'Super Admin') return true;
  const allowedRoutes = ROLE_PERMISSIONS[role] || [];
  return allowedRoutes.includes(routePath);
}
