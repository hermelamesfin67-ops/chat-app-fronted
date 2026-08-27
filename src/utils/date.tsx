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

export const formatDateSeparator = (date:Date) => {
  const messageDate = new Date(date);
  const today = new Date();

  const isToday =
    messageDate.toDateString() === today.toDateString();

  if (isToday) return "Today";

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (messageDate.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  return messageDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};