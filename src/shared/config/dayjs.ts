import dayjs from "dayjs";
import "dayjs/locale/uk";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";
import weekday from "dayjs/plugin/weekday";
import calendar from "dayjs/plugin/calendar";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.extend(weekday);
dayjs.extend(calendar);
dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(isBetween);
dayjs.extend(isToday);
dayjs.extend(isYesterday);

dayjs.locale("uk");

export const formatUkrainianDate = (date: string | Date | number): string => {
  return dayjs(date).format("D MMMM YYYY");
};

export const formatUkrainianFullDate = (
  date: string | Date | number
): string => {
  return dayjs(date).format("dddd, D MMMM YYYY");
};

export const fromNow = (date: string | Date | number): string => {
  return dayjs(date).fromNow();
};

export const isTodayDate = (date: string | Date | number): boolean => {
  return dayjs(date).isToday();
};

export const isYesterdayDate = (date: string | Date | number): boolean => {
  return dayjs(date).isYesterday();
};

export default dayjs;
