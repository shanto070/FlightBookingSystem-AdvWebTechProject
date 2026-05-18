'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';
import { api } from '@/lib/api';
import { Flight } from '@/types/flight';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { parseApiError } from '@/lib/utils';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { isRecord } from '@/lib/normalize';

interface FormData {
  passengers: { name: string; age: number; passportNumber: string }[];
}

export default function BookFlightPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'bkash' | 'nagad' | 'bank'>('card');
  const { register, control, handleSubmit } = useForm<FormData>({
    defaultValues: { passengers: [{ name: '', age: 1, passportNumber: '' }] },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'passengers' });

  useEffect(() => {
    void (async () => {
      try {
        setError('');
        const { data } = await api.get(`/flights/${params.id}`);

        if (!isRecord(data)) {
          setError('Unexpected response from server');
          setFlight(null);
          return;
        }

        setFlight(data as unknown as Flight);
      } catch (e) {
        setError(parseApiError(e));
        setFlight(null);
      }
    })();
  }, [params.id]);

  async function onSubmit(values: FormData) {
    try {
      setError('');
      setSuccess('');

      if (!flight) {
        setError('Flight not loaded');
        return;
      }

      const passengers = values.passengers.map((p) => ({ ...p, age: Number(p.age) }));

      const created = await api.post('/bookings', {
        flightId: Number(params.id),
        passengers,
      });

      // Payment step (separate endpoint) so flow matches reference.
      const bookingId = (created.data as any)?.id;
      const amount = Number(flight.price) * passengers.length;
      if (bookingId) {
        await api.post(`/bookings/${bookingId}/payment`, { amount, method: paymentMethod });
      }

      setSuccess('Booking created successfully.');
      router.push('/customer/bookings');
    } catch (e) {
      setError(parseApiError(e));
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Book Flight</h1>
      {flight && (
        <div className="rounded border bg-white p-3">
          <p className="font-semibold">{flight.flightNumber}</p>
          <p>
            {flight.origin} → {flight.destination}
          </p>
        </div>
      )}
      <ErrorMessage message={error} />
      {success && <p className="rounded bg-green-100 p-2 text-sm text-green-700">{success}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 rounded border bg-white p-4">
        <div className="grid gap-2 md:grid-cols-2">
          <div>
            <p className="mb-1 text-sm font-medium">Payment Method</p>
            <select
              className="w-full rounded border border-slate-300 px-3 py-2"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
            >
              <option value="card">card</option>
              <option value="cash">cash</option>
              <option value="bkash">bkash</option>
              <option value="nagad">nagad</option>
              <option value="bank">bank</option>
            </select>
          </div>
          <div className="rounded border bg-slate-50 p-3 text-sm">
            <p className="font-medium">Estimated Total</p>
            <p>
              {flight ? Number(flight.price) : 0} x {fields.length} ={' '}
              <span className="font-semibold">{flight ? Number(flight.price) * fields.length : 0}</span>
            </p>
          </div>
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="grid gap-2 md:grid-cols-4">
            <Input placeholder="Name" {...register(`passengers.${index}.name`)} />
            <Input type="number" min={1} placeholder="Age" {...register(`passengers.${index}.age`, { valueAsNumber: true })} />
            <Input placeholder="Passport Number" {...register(`passengers.${index}.passportNumber`)} />
            <Button type="button" className="bg-red-600" onClick={() => remove(index)}>
              Remove
            </Button>
          </div>
        ))}
        <div className="flex gap-2">
          <Button type="button" onClick={() => append({ name: '', age: 1, passportNumber: '' })}>
            Add Passenger
          </Button>
          <Button type="submit">Confirm Booking</Button>
        </div>
      </form>
    </div>
  );
}
