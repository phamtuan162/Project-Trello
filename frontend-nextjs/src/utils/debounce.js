export const debounce = (fn, t) => {
  let timeoutId;
  return function (...args) {
    // Hủy thực thi lần trước đó nếu có
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Thiết lập một lần thực thi mới
    timeoutId = setTimeout(() => {
      fn(...args);
    }, t);
  };
};
