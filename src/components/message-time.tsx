import React from "react";

type MessageTimeProps = {
  date: Date | string | number;
};

export function MessageTime({ date }: MessageTimeProps) {
  const formatted = formatMessageTime(date);

  return <span>{formatted}</span>;
}

function formatMessageTime(input: Date | string | number): string {
  const date = new Date(input);
  const now = new Date();

  if (isSameDay(date, now)) {
    // Today → 11:47
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  if (isSameWeek(date, now)) {
    // This week → MON, TUE, WED...
    return date
      .toLocaleDateString("en-US", {
        weekday: "short",
      })
      .toUpperCase();
  }

  if (date.getFullYear() === now.getFullYear()) {
    // This year, but not this week → July 21
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
  }

  // Previous year → 21/07/2025
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isSameWeek(date: Date, now: Date): boolean {
  const startOfWeek = new Date(now);
  const day = startOfWeek.getDay();

  // Convert Sunday=0 to Monday=0
  const daysFromMonday = day === 0 ? 6 : day - 1;

  startOfWeek.setDate(now.getDate() - daysFromMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  return date >= startOfWeek && date < endOfWeek;
}