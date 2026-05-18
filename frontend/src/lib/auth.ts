import { User } from '@/types/user';

const TOKEN_KEY = 'fbs_token';
const USER_KEY = 'fbs_user';

export const authStorage = {
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken(token: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
  },
  clearToken() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
  },
  getUser(): User | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  },
  setUser(user: User) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clearUser() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(USER_KEY);
  },
  clearAll() {
    this.clearToken();
    this.clearUser();
  },
};
