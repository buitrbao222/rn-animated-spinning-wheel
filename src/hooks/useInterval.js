import { useEffect } from 'react';

export default function useInterval(callback, duration, options = {}) {
  useEffect(() => {
    options.runImmediately && callback();
    setInterval(() => {
      callback();
    }, duration);
  }, []);
}
