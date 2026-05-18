'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Flight } from '@/types/flight';
import { Aircraft } from '@/types/aircraft';
import { parseApiError } from '@/lib/utils';
import { normalizeArray } from '@/lib/normalize';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface FlightForm {
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  aircraftId: number;
}

const initial: FlightForm = {
  flightNumber: '',
  origin: '',
  destination: '',
  departureTime: '',
  arrivalTime: '',
  price: 0,
  aircraftId: 1,
};

export default function AdminFlightsPage() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [aircraft, setAircraft] = useState<Aircraft[]>([]);
  const [form, setForm] = useState<FlightForm>(initial);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState('');

  async function fetchData() {
    try {
      setError('');
      const [flightsRes, aircraftRes] = await Promise.all([api.get('/flights'), api.get('/admin/aircraft')]);
      const flightRows = normalizeArray<Flight>(flightsRes.data);
      const aircraftRows = normalizeArray<Aircraft>(aircraftRes.data);
      setFlights(flightRows);
      setAircraft(aircraftRows);
      if (!Array.isArray(flightsRes.data) || !Array.isArray(aircraftRes.data)) setError('Unexpected response from server');
    } catch (e) {
      setError(parseApiError(e));
      setFlights([]);
      setAircraft([]);
    }
  }

  useEffect(() => {
    void fetchData();
  }, []);

  async function saveFlight() {
    try {
      setError('');
      if (editingId) await api.put(`/admin/flights/${editingId}`, form);
      else await api.post('/admin/flights', form);
      setForm(initial);
      setEditingId(null);
      await fetchData();
    } catch (e) {
      setError(parseApiError(e));
    }
  }

  async function removeFlight(id: number) {
    if (!confirm('Delete this flight?')) return;
    try {
      setError('');
      await api.delete(`/admin/flights/${id}`);
      await fetchData();
    } catch (e) {
      setError(parseApiError(e));
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Admin Flights</h1>
      <ErrorMessage message={error} />
      <div className="grid gap-2 rounded border bg-white p-4 md:grid-cols-4">
        <Input placeholder="Flight Number" value={form.flightNumber} onChange={(e) => setForm({ ...form, flightNumber: e.target.value })} />
        <Input placeholder="Origin" value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} />
        <Input placeholder="Destination" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} />
        <Input type="datetime-local" value={form.departureTime} onChange={(e) => setForm({ ...form, departureTime: e.target.value })} />
        <Input type="datetime-local" value={form.arrivalTime} onChange={(e) => setForm({ ...form, arrivalTime: e.target.value })} />
        <Input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
        <select className="rounded border px-3 py-2" value={form.aircraftId} onChange={(e) => setForm({ ...form, aircraftId: Number(e.target.value) })}>
          {aircraft.map((a) => (
            <option key={a.id} value={a.id}>
              {a.id} - {a.model}
            </option>
          ))}
        </select>
        <Button onClick={() => void saveFlight()}>{editingId ? 'Update Flight' : 'Create Flight'}</Button>
      </div>
      <div className="overflow-auto rounded border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-2 text-left">Number</th>
              <th className="p-2 text-left">Route</th>
              <th className="p-2 text-left">Price</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {flights.map((f) => (
              <tr key={f.id} className="border-t">
                <td className="p-2">{f.flightNumber}</td>
                <td className="p-2">{f.origin} → {f.destination}</td>
                <td className="p-2">{f.price}</td>
                <td className="p-2 flex gap-2">
                  <Button type="button" onClick={() => {
                    setEditingId(f.id);
                    setForm({
                      flightNumber: f.flightNumber,
                      origin: f.origin,
                      destination: f.destination,
                      departureTime: f.departureTime.slice(0, 16),
                      arrivalTime: f.arrivalTime.slice(0, 16),
                      price: Number(f.price),
                      aircraftId: f.aircraft?.id ?? 1,
                    });
                  }}>Edit</Button>
                  <Link className="inline-flex items-center rounded bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800" href={`/admin/flights/${f.id}/crew`}>
                    Crew
                  </Link>
                  <Button type="button" className="bg-red-600" onClick={() => void removeFlight(f.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
