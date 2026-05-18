export type UserRole = 'admin' | 'customer' | 'employee';

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: UserRole;
}
