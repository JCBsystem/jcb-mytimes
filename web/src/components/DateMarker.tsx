import dayjs from "dayjs";

interface DateMarkerProps {
  dateKey: string; // YYYY-MM-DD
}

/**
 * A tiny calendar icon showing the day number and abbreviated month.
 * Replaces the generic circle marker in the timeline.
 */
export function DateMarker({ dateKey }: DateMarkerProps) {
  const date = dayjs(dateKey);
  const day = date.format("D");
  const month = date.format("MMM").toUpperCase();

  return (
    <div className="relative z-10 flex-shrink-0 w-9 h-10 rounded-lg bg-white border border-stone-200 shadow-sm overflow-hidden">
      {/* Month bar */}
      <div className="h-3 bg-stone-700 flex items-center justify-center">
        <span className="text-[7px] font-bold tracking-wider text-white leading-none">
          {month}
        </span>
      </div>
      {/* Day number */}
      <div className="flex items-center justify-center h-7">
        <span className="text-[13px] font-bold text-stone-700 leading-none">
          {day}
        </span>
      </div>
    </div>
  );
}
