import React from 'react';
import { dbService } from '@/lib/db/client';
import { AccountClient } from '@/components/store/AccountClient';

export const revalidate = 0;

export default async function AccountPage() {
  const orders = await dbService.getOrders();
  const products = await dbService.getProducts();

  const mockWishlist = products.slice(0, 2).map(p => ({ id: `w-${p.id}`, product: p }));
  const mockAddresses = [
    {
      id: 'addr-1',
      customer_id: 'c1',
      full_name: 'Kwame Mensah',
      phone: '+233 24 000 0000',
      street_address: 'Plot 14 Oxford Street',
      city: 'Osu, Accra',
      region: 'Greater Accra',
      country: 'Ghana',
      is_default: true,
    },
  ];

  return (
    <AccountClient
      initialOrders={orders}
      initialWishlist={mockWishlist}
      initialAddresses={mockAddresses}
    />
  );
}
