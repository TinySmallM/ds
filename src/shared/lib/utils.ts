import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function createArray(length = 4, fillValue = (index: number) => index + 1) {
  return Array.from({ length }, (_, index) => fillValue(index));
}

export const isEmptyArray = (arr: unknown): boolean => {
  return Array.isArray(arr) && arr.length === 0;
};
