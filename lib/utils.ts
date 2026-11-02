import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatNumber = (n: number) => {
  if (n > 1000_000_0 && n < 1000_000_000) {
    return `${n / 10000000}M`;
  }

  if (n > 1000 && n < 1000_000_0) {
    return `${n / 1000}K`;
  }

  return n.toString();
};
