'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => (
    <input
      ref={ref}
      className={`w-full rounded border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500 ${className}`}
      {...props}
    />
  ),
);

Input.displayName = 'Input';
