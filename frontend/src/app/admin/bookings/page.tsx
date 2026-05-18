'use client';

import { useEffect, useState } from 'react';
import { Booking, BookingStatus } from '@/types/booking';
import { api } from '@/lib/api';
import { BookingTable } from '@/components/bookings/BookingTable';
import { parseApiError } from '@/lib/utils';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { normalizeArray } from '@/lib/normalize';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState('');

  async function fetchData() {
    try {
      setError('');
      const { data } = await api.get('/employee/bookings');
      setBookings(normalizeArray<Booking>(data));
    } catch (e) {
      setError(parseApiError(e));
      setBookings([]);
    }
  }

  useEffect(() => {
    void fetchData();
  }, []);

  async function updateStatus(id: number, status: BookingStatus) {
    try {
      await api.patch(`/employee/bookings/${id}/status`, { status });
      await fetchData();
    } catch (e) {
      setError(parseApiError(e));
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">All Bookings</h1>
      <ErrorMessage message={error} />
      <BookingTable bookings={bookings} detailsBasePath="/admin/bookings" />
      <div className="rounded border bg-white p-4">
        <p className="mb-2 text-sm font-semibold">Update Status</p>
        <div className="space-y-2">
          {bookings.map((b) => (
            <div key={b.id} className="flex items-center gap-2 text-sm">
              <span>Booking #{b.id}</span>
              <select
                className="rounded border px-2 py-1"
                value={b.status}
                onChange={(e) => void updateStatus(b.id, e.target.value as BookingStatus)}
              >
                <option value="pending">pending</option>
                <option value="confirmed">confirmed</option>
                <option value="cancelled">cancelled</option>
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
