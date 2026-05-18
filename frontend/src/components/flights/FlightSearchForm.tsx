'use client';

import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export interface FlightFilters {
  origin?: string;
  destination?: string;
  date?: string;
}

export function FlightSearchForm({
  onSearch,
}: {
  onSearch: (filters: FlightFilters) => void;
}) {
  const { register, handleSubmit } = useForm<FlightFilters>();
  return (
    <form
      onSubmit={handleSubmit(onSearch)}
      className="grid gap-2 rounded border bg-white p-4 md:grid-cols-4"
    >
      <Input placeholder="Origin" {...register('origin')} />
      <Input placeholder="Destination" {...register('destination')} />
      <Input type="date" {...register('date')} />
      <Button type="submit">Search</Button>
    </form>
  );
}
