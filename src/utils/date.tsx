import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export function timeAgo(date: string | Date) {
  return dayjs(date).fromNow();
}

export function formatDate(
  date?: Date | string,
  format: string = "ddd, MMM DD YYYY (h:mm A)",
): string {
  if (!date) return "";
  return dayjs(date).format(format);
}