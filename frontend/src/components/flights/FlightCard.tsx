'use client';

import Link from 'next/link';
import { Flight } from '@/types/flight';
import { formatDateTime } from '@/lib/utils';
import { Button } from '../ui/Button';

export function FlightCard({
  flight,
  canBook,
  bookLink,
  onBookDenied,
}: {
  flight: Flight;
  canBook: boolean;
  bookLink?: string;
  onBookDenied?: () => void;
}) {
  return (
    <div className="rounded border bg-white p-4">
      <p className="font-semibold">{flight.flightNumber}</p>
      <p>
        {flight.origin} → {flight.destination}
      </p>
      <p className="text-sm">Departure: {formatDateTime(flight.departureTime)}</p>
      <p className="text-sm">Arrival: {formatDateTime(flight.arrivalTime)}</p>
      <p className="text-sm">Price: {Number(flight.price).toFixed(2)}</p>
      <p className="text-xs text-slate-600">
        Aircraft: {flight.aircraft?.model ?? 'N/A'} ({flight.aircraft?.manufacturer ?? 'N/A'})
      </p>
      <div className="mt-3">
        {canBook && bookLink ? (
          <Link href={bookLink}>
            <Button type="button">Book</Button>
          </Link>
        ) : (
          <Button type="button" onClick={onBookDenied}>
            Book
          </Button>
        )}
      </div>
    </div>
  );
}
