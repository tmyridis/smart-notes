import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function stripAndSpaceElements(input: string) {
  return input
    .replace(/<[^>]*>/g, " ") // Remove all HTML tags
    .replace(/\s+/g, " ") // Normalize multiple spaces
    .trim(); // Trim leading/trailing spaces
}
