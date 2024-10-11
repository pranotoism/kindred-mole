import { useState, useEffect } from 'react';

function useDebounce(value: number, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    // update debounced value after delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // cancel the timeout if value changes (also on delay change or unmount)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // re-call effect if value or delay changes
  return debouncedValue;
}

export { useDebounce };
