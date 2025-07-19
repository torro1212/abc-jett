import { useCallback, useRef } from 'react';

interface TouchGestureOptions {
  onSwipe?: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onTap?: () => void;
  onLongPress?: () => void;
  threshold?: number;
  longPressDelay?: number;
}

export const useMobileTouch = (options: TouchGestureOptions = {}) => {
  const {
    onSwipe,
    onTap,
    onLongPress,
    threshold = 50,
    longPressDelay = 500
  } = options;

  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };

    // Start long press timer
    if (onLongPress) {
      longPressTimerRef.current = setTimeout(() => {
        onLongPress();
      }, longPressDelay);
    }
  }, [onLongPress, longPressDelay]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    
    // Clear long press timer if user moves finger
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    
    // Clear long press timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    if (!touchStartRef.current) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const deltaTime = Date.now() - touchStartRef.current.time;

    // Check if it's a tap (small movement, short duration)
    if (Math.abs(deltaX) < threshold && Math.abs(deltaY) < threshold && deltaTime < 300) {
      onTap?.();
      return;
    }

    // Check for swipe gestures
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
      onSwipe?.(deltaX > 0 ? 'right' : 'left');
    } else if (Math.abs(deltaY) > threshold) {
      onSwipe?.(deltaY > 0 ? 'down' : 'up');
    }

    touchStartRef.current = null;
  }, [onSwipe, onTap, threshold]);

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
}; 