'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { parseApiError } from '@/lib/utils';
import { isRecord } from '@/lib/normalize';
import { Profile } from '@/types/profile';

export default function CustomerProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function fetchProfile() {
    try {
      setError('');
      const { data } = await api.get('/customer/me');
      if (!isRecord(data)) {
        setError('Unexpected response from server');
        setProfile(null);
        return;
      }
      setProfile(data as unknown as Profile);
      setForm({
        name: (data as any).name ?? '',
        phone: (data as any).phone ?? '',
        address: (data as any).address ?? '',
      });
    } catch (e) {
      setError(parseApiError(e));
      setProfile(null);
    }
  }

  useEffect(() => {
    void fetchProfile();
  }, []);

  async function save() {
    try {
      setSaving(true);
      setError('');
      const { data } = await api.put('/customer/me', {
        name: form.name || undefined,
        phone: form.phone || undefined,
        address: form.address || undefined,
      });
      if (isRecord(data)) setProfile(data as unknown as Profile);
    } catch (e) {
      setError(parseApiError(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">My Profile</h1>
      <ErrorMessage message={error} />

      <div className="rounded border bg-white p-4 space-y-3 max-w-xl">
        <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <Input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>Loyalty Points: {profile?.loyaltyPoints ?? 0}</span>
          <Button onClick={() => void save()} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
}
