'use client';

import { useState } from 'react';
import { useNotifications } from '@/hooks/useNotifications';

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markAllRead } = useNotifications();

  return (
    <div className="relative">
      <button
        className="rounded border px-3 py-1 text-sm"
        onClick={() => {
          setOpen((v) => !v);
          markAllRead();
        }}
        type="button"
      >
        Notifications ({unreadCount})
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-2 w-80 rounded border bg-white p-3 shadow">
          {notifications.length === 0 ? (
            <p className="text-sm text-slate-500">No notifications yet.</p>
          ) : (
            <ul className="space-y-2">
              {notifications.slice(0, 8).map((n) => (
                <li key={n.id} className="rounded bg-slate-100 p-2 text-xs">
                  <p className="font-semibold">{n.event}</p>
                  <p>{JSON.stringify(n.payload)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
