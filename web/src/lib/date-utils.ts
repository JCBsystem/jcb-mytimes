import dayjs from "dayjs";
import type { Memory } from "@/types/memory";

/**
 * Returns a friendly date header label.
 * - "Today" / "Yesterday" for recent dates
 * - "March 20" for dates in the current year
 * - "December 15, 2025" for dates in previous years
 */
export function formatDateHeader(dateStr: string): string {
  const date = dayjs(dateStr);
  const now = dayjs();

  if (date.isSame(now, "day")) {
    return "Today";
  }

  if (date.isSame(now.subtract(1, "day"), "day")) {
    return "Yesterday";
  }

  if (date.year() === now.year()) {
    return date.format("MMMM D");
  }

  return date.format("MMMM D, YYYY");
}

/**
 * Returns a formatted time string like "2:30 PM".
 */
export function formatTime(dateStr: string): string {
  return dayjs(dateStr).format("h:mm A");
}

/**
 * Groups memories by eventDate (date portion only).
 * - Keys are date strings (YYYY-MM-DD)
 * - Groups are sorted by date descending (most recent first)
 * - Memories within each group are sorted by eventDate time descending
 */
export function groupMemoriesByDate(
  memories: Memory[],
): Map<string, Memory[]> {
  const groups = new Map<string, Memory[]>();

  for (const memory of memories) {
    const dateKey = dayjs(memory.eventDate).format("YYYY-MM-DD");
    const existing = groups.get(dateKey);
    if (existing) {
      existing.push(memory);
    } else {
      groups.set(dateKey, [memory]);
    }
  }

  // Sort memories within each group by eventDate descending
  for (const [, group] of groups) {
    group.sort(
      (a, b) =>
        dayjs(b.eventDate).valueOf() - dayjs(a.eventDate).valueOf(),
    );
  }

  // Rebuild map sorted by date key descending
  const sortedEntries = [...groups.entries()].sort(
    ([a], [b]) => dayjs(b).valueOf() - dayjs(a).valueOf(),
  );

  return new Map(sortedEntries);
}
