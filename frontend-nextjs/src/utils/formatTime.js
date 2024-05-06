import { subDays, isWithinInterval, subMonths } from "date-fns";

export function formatTimeAgo(isoDateString) {
  const currentTime = new Date();
  const pastTime = new Date(isoDateString);
  const timeDifference = currentTime.getTime() - pastTime.getTime();

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) {
    return `${years} năm trước`;
  } else if (months > 0) {
    return `${months} tháng trước`;
  } else if (weeks > 0) {
    return `${weeks} tuần trước`;
  } else if (days > 0) {
    return `${days} ngày trước`;
  } else if (hours > 0) {
    return `${hours} giờ trước`;
  } else if (minutes > 0) {
    return `${minutes} phút trước`;
  } else {
    return `vài giây trước`;
  }
}

export const isWithinLastTwoWeeks = (dateToCheck) => {
  const currentDate = new Date();
  const twoWeeksAgo = subDays(currentDate, 14);

  const interval = { start: twoWeeksAgo, end: currentDate };

  return isWithinInterval(dateToCheck, interval);
};

export const isWithinLastWeek = (dateToCheck) => {
  const currentDate = new Date();
  const weekAgo = subDays(currentDate, 7);

  const interval = { start: weekAgo, end: currentDate };

  return isWithinInterval(dateToCheck, interval);
};

export const isWithinLastMonth = (dateToCheck) => {
  const currentDate = new Date();
  const monthAgo = subMonths(currentDate, 1);

  const interval = { start: monthAgo, end: currentDate };

  return isWithinInterval(dateToCheck, interval);
};
