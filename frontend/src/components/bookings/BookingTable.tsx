'use client';

import Link from 'next/link';
import { Booking } from '@/types/booking';
import { formatDateTime } from '@/lib/utils';

export function BookingTable({
  bookings,
  detailsBasePath,
}: {
  bookings: Booking[];
  detailsBasePath: string;
}) {
  return (
    <div className="overflow-auto rounded border bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Customer</th>
            <th className="p-2 text-left">Flight</th>
            <th className="p-2 text-left">Route</th>
            <th className="p-2 text-left">Passengers</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Date</th>
            <th className="p-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} className="border-t">
              <td className="p-2">{booking.id}</td>
              <td className="p-2">{booking.user?.fullName}</td>
              <td className="p-2">{booking.flight?.flightNumber ?? '-'}</td>
              <td className="p-2">
                {booking.flight?.origin ?? '-'} → {booking.flight?.destination ?? '-'}
              </td>
              <td className="p-2">{booking.totalPassengers}</td>
              <td className="p-2">{booking.status}</td>
              <td className="p-2">{formatDateTime(booking.bookingDate)}</td>
              <td className="p-2">
                <Link className="text-blue-600" href={`${detailsBasePath}/${booking.id}`}>
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
