import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  return (
    <main className="container-page space-y-4">
      <h1 className="text-3xl font-bold">Flight Booking System</h1>
      <div className="flex gap-3">
        <Link href="/login">
          <Button>Login</Button>
        </Link>
        <Link href="/register">
          <Button>Register</Button>
        </Link>
        <Link href="/flights">
          <Button>Browse Flights</Button>
        </Link>
      </div>
    </main>
  );
}
