import Link from 'next/link';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <div className="grid gap-3 md:grid-cols-2">
        <Link className="rounded border bg-white p-4 hover:bg-slate-50" href="/admin/flights">
          Manage Flights
        </Link>
        <Link className="rounded border bg-white p-4 hover:bg-slate-50" href="/admin/aircraft">
          Manage Aircraft
        </Link>
        <Link className="rounded border bg-white p-4 hover:bg-slate-50" href="/admin/employees">
          Manage Employees
        </Link>
        <Link className="rounded border bg-white p-4 hover:bg-slate-50" href="/admin/bookings">
          View Bookings
        </Link>
      </div>
    </div>
  );
}
