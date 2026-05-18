'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Employee } from '@/types/employee';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { parseApiError } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { normalizeArray } from '@/lib/normalize';

interface FormData {
  userId: number;
  roleType: string;
  assignedFlightIds: string;
}

const initial: FormData = { userId: 0, roleType: '', assignedFlightIds: '' };

export default function AdminEmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [form, setForm] = useState<FormData>(initial);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState('');

  async function fetchData() {
    try {
      setError('');
      const { data } = await api.get('/admin/employees');
      setEmployees(normalizeArray<Employee>(data));
    } catch (e) {
      setError(parseApiError(e));
      setEmployees([]);
    }
  }

  useEffect(() => {
    void fetchData();
  }, []);

  function mapFlights(input: string): number[] {
    return input
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean)
      .map(Number);
  }

  async function save() {
    try {
      setError('');
      const payload = {
        userId: Number(form.userId),
        roleType: form.roleType,
        assignedFlightIds: mapFlights(form.assignedFlightIds),
      };
      if (editingId) await api.patch(`/admin/employees/${editingId}`, payload);
      else await api.post('/admin/employees', payload);
      setForm(initial);
      setEditingId(null);
      await fetchData();
    } catch (e) {
      setError(parseApiError(e));
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Admin Employees</h1>
      <p className="text-sm text-slate-600">Enter existing employee user ID when creating.</p>
      <ErrorMessage message={error} />
      <div className="grid gap-2 rounded border bg-white p-4 md:grid-cols-4">
        <Input type="number" placeholder="User ID" value={form.userId} onChange={(e) => setForm({ ...form, userId: Number(e.target.value) })} />
        <Input placeholder="Role Type" value={form.roleType} onChange={(e) => setForm({ ...form, roleType: e.target.value })} />
        <Input placeholder="Assigned Flight IDs (1,2)" value={form.assignedFlightIds} onChange={(e) => setForm({ ...form, assignedFlightIds: e.target.value })} />
        <Button onClick={() => void save()}>{editingId ? 'Update Employee' : 'Create Employee'}</Button>
      </div>
      <div className="overflow-auto rounded border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">User</th>
              <th className="p-2 text-left">Role Type</th>
              <th className="p-2 text-left">Assigned Flights</th>
              <th className="p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((e) => (
              <tr key={e.id} className="border-t">
                <td className="p-2">{e.id}</td>
                <td className="p-2">
                  {e.user.fullName} ({e.user.id})
                </td>
                <td className="p-2">{e.roleType}</td>
                <td className="p-2">{normalizeArray<{ id: number }>(e.assignedFlights).map((f) => f.id).join(', ') || '-'}</td>
                <td className="p-2">
                  <Button
                    type="button"
                    onClick={() => {
                      setEditingId(e.id);
                      setForm({
                        userId: e.user.id,
                        roleType: e.roleType,
                        assignedFlightIds: normalizeArray<{ id: number }>(e.assignedFlights).map((f) => f.id).join(',') || '',
                      });
                    }}
                  >
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
