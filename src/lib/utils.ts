import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isObjectEmpty(obj: Record<string, unknown>) {
  return !obj || Object.keys(obj).length === 0;
}
