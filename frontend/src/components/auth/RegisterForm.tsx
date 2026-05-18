'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ErrorMessage } from '../ui/ErrorMessage';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { parseApiError } from '@/lib/utils';
import { UserRole } from '@/types/user';

const schema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['customer', 'employee', 'admin']),
});

type FormData = z.infer<typeof schema>;

export function RegisterForm() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'customer' },
  });

  async function onSubmit(values: FormData) {
    try {
      setLoading(true);
      setError('');
      const currentUser = await registerUser(values as FormData & { role: UserRole });
      if (currentUser.role === 'admin') router.push('/admin/dashboard');
      else if (currentUser.role === 'employee') router.push('/employee/dashboard');
      else router.push('/customer/dashboard');
    } catch (e) {
      setError(parseApiError(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-md space-y-3 rounded border bg-white p-5">
      <h1 className="text-xl font-semibold">Register</h1>
      <ErrorMessage message={error} />
      <Input placeholder="Full Name" {...register('fullName')} />
      <Input placeholder="Email" {...register('email')} />
      <Input placeholder="Password" type="password" {...register('password')} />
      <select className="w-full rounded border border-slate-300 px-3 py-2" {...register('role')}>
        <option value="customer">customer</option>
        <option value="employee">employee</option>
        <option value="admin">admin</option>
      </select>
      <Button type="submit" disabled={loading}>
        {loading ? 'Creating account...' : 'Register'}
      </Button>
    </form>
  );
}
