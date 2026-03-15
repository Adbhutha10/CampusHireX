import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string, options: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
}) {
  return new Date(date).toLocaleDateString("en-GB", options)
}

export function formatTime(date: Date | string, options: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
}) {
  return new Date(date).toLocaleTimeString("en-GB", options)
}
