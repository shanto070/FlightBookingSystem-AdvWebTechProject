'use client';

import Link from 'next/link';
import { UserRole } from '@/types/user';

const roleMenus: Record<UserRole, { label: string; href: string }[]> = {
  customer: [
    { label: 'Dashboard', href: '/customer/dashboard' },
    { label: 'Flights', href: '/customer/flights' },
    { label: 'My Bookings', href: '/customer/bookings' },
    { label: 'Profile', href: '/customer/profile' },
  ],
  employee: [
    { label: 'Dashboard', href: '/employee/dashboard' },
    { label: 'Bookings', href: '/employee/bookings' },
  ],
  admin: [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Flights', href: '/admin/flights' },
    { label: 'Aircraft', href: '/admin/aircraft' },
    { label: 'Employees', href: '/admin/employees' },
    { label: 'Bookings', href: '/admin/bookings' },
  ],
};

export function Sidebar({ role }: { role: UserRole }) {
  return (
    <aside className="w-60 border-r bg-white p-4">
      <ul className="space-y-2">
        {roleMenus[role].map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="block rounded px-2 py-1 hover:bg-slate-100">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
