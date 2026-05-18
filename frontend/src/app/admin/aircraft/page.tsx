'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Aircraft } from '@/types/aircraft';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { parseApiError } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { normalizeArray } from '@/lib/normalize';

interface FormData {
  model: string;
  capacity: number;
  manufacturer: string;
}

const initial: FormData = { model: '', capacity: 0, manufacturer: '' };

export default function AdminAircraftPage() {
  const [aircraft, setAircraft] = useState<Aircraft[]>([]);
  const [form, setForm] = useState<FormData>(initial);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState('');

  async function fetchData() {
    try {
      setError('');
      const { data } = await api.get('/admin/aircraft');
      setAircraft(normalizeArray<Aircraft>(data));
    } catch (e) {
      setError(parseApiError(e));
      setAircraft([]);
    }
  }

  useEffect(() => {
    void fetchData();
  }, []);

  async function save() {
    try {
      setError('');
      if (editingId) await api.put(`/admin/aircraft/${editingId}`, form);
      else await api.post('/admin/aircraft', form);
      setForm(initial);
      setEditingId(null);
      await fetchData();
    } catch (e) {
      setError(parseApiError(e));
    }
  }

  async function remove(id: number) {
    if (!confirm('Delete this aircraft?')) return;
    try {
      await api.delete(`/admin/aircraft/${id}`);
      await fetchData();
    } catch (e) {
      setError(parseApiError(e));
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Admin Aircraft</h1>
      <ErrorMessage message={error} />
      <div className="grid gap-2 rounded border bg-white p-4 md:grid-cols-4">
        <Input placeholder="Model" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} />
        <Input type="number" placeholder="Capacity" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} />
        <Input placeholder="Manufacturer" value={form.manufacturer} onChange={(e) => setForm({ ...form, manufacturer: e.target.value })} />
        <Button onClick={() => void save()}>{editingId ? 'Update Aircraft' : 'Create Aircraft'}</Button>
      </div>
      <div className="overflow-auto rounded border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Model</th>
              <th className="p-2 text-left">Capacity</th>
              <th className="p-2 text-left">Manufacturer</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {aircraft.map((a) => (
              <tr key={a.id} className="border-t">
                <td className="p-2">{a.id}</td>
                <td className="p-2">{a.model}</td>
                <td className="p-2">{a.capacity}</td>
                <td className="p-2">{a.manufacturer}</td>
                <td className="p-2 flex gap-2">
                  <Button type="button" onClick={() => {
                    setEditingId(a.id);
                    setForm({ model: a.model, capacity: a.capacity, manufacturer: a.manufacturer });
                  }}>Edit</Button>
                  <Button type="button" className="bg-red-600" onClick={() => void remove(a.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
