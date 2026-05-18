'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Button } from '@/components/ui/Button';
import { parseApiError } from '@/lib/utils';
import { normalizeArray } from '@/lib/normalize';
import { Employee } from '@/types/employee';

export default function AdminFlightCrewPage() {
  const params = useParams<{ id: string }>();
  const flightId = Number(params.id);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [crew, setCrew] = useState<Employee[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number>(0);
  const [error, setError] = useState('');

  async function fetchData() {
    try {
      setError('');
      const [employeesRes, crewRes] = await Promise.all([
        api.get('/admin/employees'),
        api.get(`/admin/employees/flights/${flightId}/crew`),
      ]);
      const all = normalizeArray<Employee>(employeesRes.data);
      const current = normalizeArray<Employee>(crewRes.data);
      setEmployees(all);
      setCrew(current);
      setSelectedEmployeeId(all[0]?.id ?? 0);
    } catch (e) {
      setError(parseApiError(e));
      setEmployees([]);
      setCrew([]);
    }
  }

  useEffect(() => {
    if (!Number.isFinite(flightId) || flightId <= 0) return;
    void fetchData();
  }, [flightId]);

  async function assign() {
    try {
      setError('');
      if (!selectedEmployeeId) return;
      await api.post(`/admin/employees/flights/${flightId}/crew/${selectedEmployeeId}`);
      await fetchData();
    } catch (e) {
      setError(parseApiError(e));
    }
  }

  async function remove(employeeId: number) {
    try {
      setError('');
      await api.patch(`/admin/employees/flights/${flightId}/crew/${employeeId}/remove`);
      await fetchData();
    } catch (e) {
      setError(parseApiError(e));
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Flight Crew</h1>
        <Link className="text-sm text-blue-600" href="/admin/flights">
          Back to Flights
        </Link>
      </div>

      <ErrorMessage message={error} />

      <div className="rounded border bg-white p-4 space-y-3">
        <p className="text-sm text-slate-600">Flight ID: {flightId}</p>
        <div className="flex gap-2 items-center">
          <select
            className="rounded border px-3 py-2"
            value={selectedEmployeeId}
            onChange={(e) => setSelectedEmployeeId(Number(e.target.value))}
          >
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                #{e.id} {e.user?.fullName ?? ''} ({e.roleType})
              </option>
            ))}
          </select>
          <Button onClick={() => void assign()} disabled={!selectedEmployeeId}>
            Assign To Crew
          </Button>
        </div>
      </div>

      <div className="rounded border bg-white p-4">
        <p className="mb-2 text-sm font-semibold">Current Crew</p>
        {crew.length === 0 ? (
          <p className="text-sm text-slate-600">No crew assigned.</p>
        ) : (
          <div className="space-y-2">
            {crew.map((e) => (
              <div key={e.id} className="flex items-center justify-between rounded border p-2 text-sm">
                <span>
                  #{e.id} {e.user?.fullName ?? '-'} ({e.roleType})
                </span>
                <Button className="bg-red-600" onClick={() => void remove(e.id)}>
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
