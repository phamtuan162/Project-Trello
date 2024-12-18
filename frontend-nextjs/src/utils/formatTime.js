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

export const checkCardCreationDate = (selected, cardCreatedDate) => {
  if (selected === "week") {
    return isWithinLastWeek(cardCreatedDate);
  } else if (selected === "two_weeks") {
    return isWithinLastTwoWeeks(cardCreatedDate);
  } else {
    return isWithinLastMonth(cardCreatedDate);
  }
};

export const validateHourMinute = (hour, minute) => {
  return (
    !isNaN(hour) &&
    !isNaN(minute) &&
    parseInt(hour) >= 0 &&
    parseInt(hour) <= 23 &&
    parseInt(minute) >= 0 &&
    parseInt(minute) <= 59
  );
};

export function truncateTimeFromDate(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getStatusByDate(date) {
  if (!date) return "normal"; // Không có ngày, trạng thái mặc định

  const now = new Date();
  const targetDate = new Date(date);

  if (now > targetDate) return "expired"; // Đã hết hạn

  const daysDifference = Math.ceil((targetDate - now) / (1000 * 60 * 60 * 24)); // Tính số ngày còn lại
  if (daysDifference <= 2) return "up_expired"; // Gần hết hạn (trong vòng 2 ngày)

  return "normal"; // Trạng thái bình thường
}
