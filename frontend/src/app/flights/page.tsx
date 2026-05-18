'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { parseApiError } from '@/lib/utils';
import { normalizeArray } from '@/lib/normalize';
import { Flight } from '@/types/flight';
import { FlightCard } from '@/components/flights/FlightCard';
import { FlightFilters, FlightSearchForm } from '@/components/flights/FlightSearchForm';
import { useAuth } from '@/hooks/useAuth';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

export default function PublicFlightsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [error, setError] = useState('');

  async function fetchFlights(filters?: FlightFilters) {
    try {
      setError('');
      const { data } = await api.get('/flights', { params: filters });
      const rows = normalizeArray<Flight>(data);
      setFlights(rows);
      if (rows.length === 0 && !Array.isArray(data)) setError('Unexpected response from server');
    } catch (e) {
      setError(parseApiError(e));
      setFlights([]);
    }
  }

  useEffect(() => {
    void fetchFlights();
  }, []);

  function handleBookClick(flightId: number) {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (user?.role !== 'customer') {
      alert('Only customers can book flights.');
      return;
    }
    router.push(`/customer/flights/${flightId}/book`);
  }

  return (
    <main className="container-page space-y-4">
      <h1 className="text-2xl font-semibold">Browse Flights</h1>
      <FlightSearchForm onSearch={fetchFlights} />
      <ErrorMessage message={error} />
      <div className="grid gap-3 md:grid-cols-2">
        {flights.map((flight) => (
          <FlightCard
            key={flight.id}
            flight={flight}
            canBook={isAuthenticated && user?.role === 'customer'}
            bookLink={isAuthenticated && user?.role === 'customer' ? `/customer/flights/${flight.id}/book` : undefined}
            onBookDenied={() => handleBookClick(flight.id)}
          />
        ))}
      </div>
    </main>
  );
}
