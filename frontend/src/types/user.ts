export type UserRole = 'admin' | 'employee' | 'customer';

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: UserRole;
}
