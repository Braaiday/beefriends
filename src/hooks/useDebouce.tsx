import { useMemo, useState, useEffect, useCallback } from "react";

// ----------------------------------------------------------------------

export function useDebounce(value: string, delay = 1000) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  const debounceHandler = useCallback(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  useEffect(() => {
    debounceHandler();
  }, [debounceHandler]);

  const memoizedValue = useMemo(() => debouncedValue, [debouncedValue]);

  return memoizedValue;
}
