import React from 'react';
import { dbService } from '@/lib/db/client';
import { AccountClient } from '@/components/store/AccountClient';

export const revalidate = 0;

export default async function AccountPage() {
  const orders = await dbService.getOrders();

  return (
    <AccountClient
      initialOrders={orders}
      initialWishlist={[]}
      initialAddresses={[]}
    />
  );
}
