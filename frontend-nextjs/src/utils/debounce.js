import { useState, useEffect } from "react";

export const debounce = (fn, t) => {
  let timeoutId;
  const debounced = function (...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => fn.apply(this, args), t);
  };

  debounced.cancel = () => {
    clearTimeout(timeoutId); // Hủy bỏ timeout hiện tại nếu có
  };

  return debounced;
};

export const useDebounce = (value, delay) => {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debounceValue;
};
