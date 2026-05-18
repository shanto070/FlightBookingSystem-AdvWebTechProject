'use client';

import { useEffect, useState } from 'react';
import { Booking } from '@/types/booking';
import { api } from '@/lib/api';
import { BookingTable } from '@/components/bookings/BookingTable';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { parseApiError } from '@/lib/utils';
import { normalizeArray } from '@/lib/normalize';

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    void (async () => {
      try {
        setError('');
        const { data } = await api.get('/customer/booking');
        setBookings(normalizeArray<Booking>(data));
      } catch (e) {
        setError(parseApiError(e));
        setBookings([]);
      }
    })();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">My Bookings</h1>
      <ErrorMessage message={error} />
      <BookingTable bookings={bookings} detailsBasePath="/customer/bookings" />
    </div>
  );
}
