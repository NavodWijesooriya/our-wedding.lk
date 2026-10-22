'use client';

import React, { useState } from 'react';
import { Calendar, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface AddToCalendarProps {
  title: string;
  weddingDate: string;
  weddingTime: string;
  location: string;
  description: string;
  className?: string;
}

export function AddToCalendar({
  title,
  weddingDate,
  weddingTime,
  location,
  description,
  className,
}: AddToCalendarProps) {
  const [open, setOpen] = useState(false);

  // Parse date and time into YYYYMMDDTHHMMSSZ
  const formatDateForCalendar = () => {
    try {
      const d = new Date(`${weddingDate}T16:00:00`);
      const pad = (n: number) => String(n).padStart(2, '0');
      const startStr = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T200000Z`;
      const endStr = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T235959Z`;
      return { startStr, endStr };
    } catch {
      return { startStr: '20261128T200000Z', endStr: '20261128T235959Z' };
    }
  };

  const { startStr, endStr } = formatDateForCalendar();

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    title
  )}&dates=${startStr}/${endStr}&details=${encodeURIComponent(
    description
  )}&location=${encodeURIComponent(location)}`;

  const downloadIcs = () => {
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//EternalTie//Wedding Invitation//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${title}`,
      `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
      `LOCATION:${location}`,
      `DTSTART:${startStr}`,
      `DTEND:${endStr}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${title.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`relative inline-block ${className || ''}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(!open)}
        leftIcon={<Calendar className="w-4 h-4 text-rose-500" />}
      >
        Save the Date to Calendar
      </Button>

      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 rounded-2xl bg-white p-2 shadow-xl border border-stone-100 z-30 flex flex-col gap-1 text-left text-xs">
          <a
            href={googleCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between p-2 rounded-xl hover:bg-stone-50 font-medium text-stone-700 transition"
          >
            <span>Google Calendar</span>
            <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
          </a>
          <button
            onClick={() => {
              downloadIcs();
              setOpen(false);
            }}
            className="flex items-center justify-between p-2 rounded-xl hover:bg-stone-50 font-medium text-stone-700 transition text-left cursor-pointer"
          >
            <span>Apple / Outlook (.ics)</span>
            <Download className="w-3.5 h-3.5 text-stone-400" />
          </button>
        </div>
      )}
    </div>
  );
}
