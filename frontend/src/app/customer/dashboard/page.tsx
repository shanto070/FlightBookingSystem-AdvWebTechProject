'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { parseApiError } from '@/lib/utils';
import { normalizeArray } from '@/lib/normalize';

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const [totalBookings, setTotalBookings] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    void (async () => {
      try {
        setError('');
        const { data } = await api.get('/customer/booking');
        setTotalBookings(normalizeArray<unknown>(data).length);
      } catch (e) {
        setError(parseApiError(e));
        setTotalBookings(0);
      }
    })();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Welcome, {user?.fullName}</h1>
      <ErrorMessage message={error} />
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded border bg-white p-4">
          <p className="text-sm text-slate-500">Total Bookings</p>
          <p className="text-3xl font-bold">{totalBookings}</p>
        </div>
      </div>
      <div className="flex gap-4">
        <Link href="/customer/flights" className="text-blue-600">
          Search Flights
        </Link>
        <Link href="/customer/bookings" className="text-blue-600">
          My Bookings
        </Link>
      </div>
    </div>
  );
}
