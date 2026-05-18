'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '../ui/Button';
import { NotificationBell } from '../notifications/NotificationBell';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  return (
    <nav className="border-b bg-white">
      <div className="container-page flex items-center justify-between py-3">
        <Link href="/" className="font-semibold">
          Flight Booking System
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/flights" className="text-sm text-blue-600">
            Browse Flights
          </Link>
          {isAuthenticated && (
            <>
              <NotificationBell />
              <p className="text-sm">
                {user?.fullName} ({user?.role})
              </p>
              <Button
                onClick={() => {
                  logout();
                  router.push('/login');
                }}
              >
                Logout
              </Button>
            </>
          )}
          {!isAuthenticated && (
            <>
              <Link href="/login" className="text-sm text-blue-600">
                Login
              </Link>
              <Link href="/register" className="text-sm text-blue-600">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
