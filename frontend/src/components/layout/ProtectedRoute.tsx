'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/user';
import { Loading } from '../ui/Loading';

export function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }
    if (!user || !allowedRoles.includes(user.role)) {
      router.replace('/login');
    }
  }, [allowedRoles, isAuthenticated, loading, router, user]);

  if (loading || !isAuthenticated || !user) return <Loading />;
  if (!allowedRoles.includes(user.role)) return <p>Unauthorized Access</p>;
  return <>{children}</>;
}
