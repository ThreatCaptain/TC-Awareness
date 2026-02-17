import { subWeeks, subMonths, subQuarters, startOfDay } from "date-fns";
import type { DateRange } from "@/data/types";

export interface DateBounds {
  start: Date;
  end: Date;
  prevStart: Date;
  prevEnd: Date;
}

export function getDateBounds(range: DateRange): DateBounds {
  const now = new Date();
  const end = now;
  let start: Date;
  let prevStart: Date;
  let prevEnd: Date;

  switch (range) {
    case "week":
      start = subWeeks(now, 1);
      prevEnd = start;
      prevStart = subWeeks(start, 1);
      break;
    case "month":
      start = subMonths(now, 1);
      prevEnd = start;
      prevStart = subMonths(start, 1);
      break;
    case "quarter":
      start = subQuarters(now, 1);
      prevEnd = start;
      prevStart = subQuarters(start, 1);
      break;
    case "all":
    default:
      start = new Date("2020-01-01");
      prevEnd = start;
      prevStart = new Date("2019-01-01");
      break;
  }

  return {
    start: startOfDay(start),
    end,
    prevStart: startOfDay(prevStart),
    prevEnd,
  };
}
