import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ConvertToHttpsType } from '@/types';
import type { ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function customDatePost(timestamp: number): string {
  const now = Date.now();
  const timeDiff = now - timestamp;

  switch (true) {
    case timeDiff < 60000:
      const seconds = Math.floor(timeDiff / 1000);
      return seconds + 's';
    case timeDiff < 3600000:
      const minutes = Math.floor(timeDiff / 60000);
      return minutes + 'm';
    case timeDiff < 86400000:
      const hours = Math.floor(timeDiff / 3600000);
      return hours + 'h';
    case timeDiff < 604800000:
      const days = Math.floor(timeDiff / 86400000);
      return days + 'd';
    case timeDiff < 31536000000:
      const weeks = Math.floor(timeDiff / 604800000);
      return weeks + 'w';
    default:
      const years = Math.floor(timeDiff / 31536000000);
      return years + 'y';
  }
}

export const formatDateTime = (Date: Date): string => {
  const formattedTime = Date.toLocaleString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
  const formattedDate = Date.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return `${formattedTime} · ${formattedDate}`;
};

export const toastOptions = {
  duration: 2000,
  style: {
    color: '#fff',
    backgroundColor: '#1D9BF0'
  }
};

export const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

export function convertToHttps(url: string): ConvertToHttpsType {
  if (!url) return;

  if (url.startsWith('https://')) {
    return {
      href: url,
      title: url.slice(8)
    };
  } else if (url.startsWith('http://')) {
    return {
      href: 'https://' + url.slice(7),
      title: url.slice(7)
    };
  } else {
    return {
      href: 'https://' + url,
      title: url
    };
  }
}

export const getCurrentPath = (): string => {
  const path = window.location.pathname;
  const searchParams = window.location.search;

  return `${path}${searchParams}`;
};

export const isValidPage = (qPage: string): number => {
  const page = parseInt(qPage);

  if (page < 0 || isNaN(page)) return 0;
  return page;
};
