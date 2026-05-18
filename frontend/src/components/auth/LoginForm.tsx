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

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type FormData = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormData) {
    try {
      setLoading(true);
      setError('');
      const currentUser = await login(values);
      const role = currentUser.role;
      if (role === 'admin') router.push('/admin/dashboard');
      else if (role === 'employee') router.push('/employee/dashboard');
      else router.push('/customer/dashboard');
    } catch (e) {
      setError(parseApiError(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-md space-y-3 rounded border bg-white p-5">
      <h1 className="text-xl font-semibold">Login</h1>
      <ErrorMessage message={error} />
      <Input placeholder="Email" {...register('email')} />
      <Input placeholder="Password" type="password" {...register('password')} />
      <Button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
}
