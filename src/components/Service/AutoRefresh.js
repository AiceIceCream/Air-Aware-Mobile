import { useEffect, useRef } from 'react';

export default function AutoRefresh({ fetchData, interval = 10000 }) {
  const intervalRef = useRef();

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      fetchData();
    }, interval);

    return () => clearInterval(intervalRef.current);
  }, [fetchData, interval]);

  return null;
}
