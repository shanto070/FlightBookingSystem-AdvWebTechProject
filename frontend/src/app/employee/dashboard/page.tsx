'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { parseApiError } from '@/lib/utils';
import { normalizeArray } from '@/lib/normalize';

export default function EmployeeDashboardPage() {
  const [totalBookings, setTotalBookings] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    void (async () => {
      try {
        setError('');
        const { data } = await api.get('/employee/bookings');
        setTotalBookings(normalizeArray<unknown>(data).length);
      } catch (e) {
        setError(parseApiError(e));
        setTotalBookings(0);
      }
    })();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Employee Dashboard</h1>
      <ErrorMessage message={error} />
      <div className="rounded border bg-white p-4">
        <p className="text-sm text-slate-500">Total Bookings</p>
        <p className="text-3xl font-bold">{totalBookings}</p>
      </div>
      <Link href="/employee/bookings" className="text-blue-600">
        Go to Booking Management
      </Link>
    </div>
  );
}
