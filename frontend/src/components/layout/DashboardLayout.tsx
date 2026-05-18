'use client';

import { ProtectedRoute } from './ProtectedRoute';
import { Sidebar } from './Sidebar';
import { UserRole } from '@/types/user';
import { useAuth } from '@/hooks/useAuth';

export function DashboardLayout({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles: UserRole[];
}) {
  const { user } = useAuth();
  return (
    <ProtectedRoute allowedRoles={roles}>
      <div className="flex min-h-[calc(100vh-64px)]">
        {user && <Sidebar role={user.role} />}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
