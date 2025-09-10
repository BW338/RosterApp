// utils.js
import { SPANISH_TO_ENGLISH_DAY } from "./constants";

export const getLastDayOfMonth = (year, monthIndex) =>
  new Date(year, monthIndex + 1, 0).getDate();

export const normalizeDay = (dayStr) => {
  const match = dayStr.match(/^(\d{1,2})([A-Z]{3})$/);
  if (!match) return dayStr;
  const dayNum = match[1];
  const engDay = SPANISH_TO_ENGLISH_DAY[match[2]] || match[2];
  return `${dayNum}${engDay}`;
};

export const isTime = (t) => /^\d{1,2}:\d{2}$/.test(t);
export const isAirport = (t) => /^[A-Z]{3}$/.test(t);
