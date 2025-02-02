import { useState, useCallback } from 'react';

interface RippleState {
  x: number;
  y: number;
  timestamp: number;
}

export const useRipple = () => {
  const [rippleMap, setRippleMap] = useState<{ [key: string]: RippleState }>({});

  const createRipple = useCallback((event: React.MouseEvent | React.TouchEvent, id: string) => {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    
    let x, y;
    if ('touches' in event) {
      x = event.touches[0].clientX - rect.left;
      y = event.touches[0].clientY - rect.top;
    } else {
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
    }

    setRippleMap(prev => ({
      ...prev,
      [id]: { x, y, timestamp: Date.now() }
    }));

    setTimeout(() => {
      setRippleMap(prev => {
        const newMap = { ...prev };
        delete newMap[id];
        return newMap;
      });
    }, 1000);
  }, []);

  return { rippleMap, createRipple };
}; 