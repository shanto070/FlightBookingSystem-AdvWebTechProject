'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Booking, BookingStatus } from '@/types/booking';
import { api } from '@/lib/api';
import { parseApiError } from '@/lib/utils';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Button } from '@/components/ui/Button';
import { isRecord } from '@/lib/normalize';

export default function EmployeeBookingDetailsPage() {
  const params = useParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [status, setStatus] = useState<BookingStatus>('pending');
  const [error, setError] = useState('');

  async function fetchData() {
    try {
      setError('');
      const { data } = await api.get(`/bookings/${params.id}`);

      if (!isRecord(data) || typeof data.status !== 'string') {
        setError('Unexpected response from server');
        setBooking(null);
        return;
      }

      setBooking(data as unknown as Booking);
      setStatus(data.status as BookingStatus);
    } catch (e) {
      setError(parseApiError(e));
      setBooking(null);
    }
  }

  useEffect(() => {
    void fetchData();
  }, [params.id]);

  async function updateStatus() {
    try {
      await api.patch(`/employee/bookings/${params.id}/status`, { status });
      await fetchData();
    } catch (e) {
      setError(parseApiError(e));
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Booking Details</h1>
      <ErrorMessage message={error} />
      {booking && (
        <div className="rounded border bg-white p-4 space-y-2">
          <p>Booking ID: {booking.id}</p>
          <p>
            Customer: {booking.user?.fullName ?? '-'} ({booking.user?.email ?? '-'})
          </p>
          <p>Flight: {booking.flight?.flightNumber ?? '-'}</p>
          <p>Total Passengers: {booking.totalPassengers}</p>
          <p>
            Payment:{' '}
            {booking.payment ? (
              <span>
                {booking.payment.method} ({booking.payment.amount})
              </span>
            ) : (
              '-'
            )}
          </p>
          <div className="flex items-center gap-2">
            <select className="rounded border px-2 py-1" value={status} onChange={(e) => setStatus(e.target.value as BookingStatus)}>
              <option value="pending">pending</option>
              <option value="confirmed">confirmed</option>
              <option value="cancelled">cancelled</option>
            </select>
            <Button onClick={() => void updateStatus()}>Update Status</Button>
          </div>
        </div>
      )}
    </div>
  );
}
