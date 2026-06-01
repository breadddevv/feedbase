import TimeAgo from "javascript-time-ago";
import "javascript-time-ago/locale/en";
const timeAgo = new TimeAgo("en");

export function formatTimeAgo(date: Date) {
  return timeAgo.format(date);
}