'use client';

import { ButtonHTMLAttributes } from 'react';

export function Button({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-60 ${className}`}
      {...props}
    />
  );
}
