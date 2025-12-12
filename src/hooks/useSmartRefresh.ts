import { useEffect, useRef, useCallback, useState } from "react";

interface UseSmartRefreshOptions {
  interval?: number;
  enabled?: boolean;
  onlyWhenVisible?: boolean; // Don't refresh when tab is hidden
}

export function useSmartRefresh(
  callback: () => void | Promise<void>,
  options: UseSmartRefreshOptions = {}
) {
  const { interval = 30000, enabled = true, onlyWhenVisible = true } = options;
  const callbackRef = useRef(callback);
  const isRefreshingRef = useRef(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Define refresh function first
  const refresh = useCallback(async () => {
    if (isRefreshingRef.current) return;

    isRefreshingRef.current = true;
    try {
      await callbackRef.current();
    } catch (error) {
      console.error("Auto-refresh error:", error);
    } finally {
      isRefreshingRef.current = false;
    }
  }, []);

  // Track tab visibility - now refresh is defined
  useEffect(() => {
    if (!onlyWhenVisible) return;

    const handleVisibilityChange = () => {
      const visible = !document.hidden;
      setIsVisible(visible);

      // Refresh immediately when tab becomes visible
      if (visible && enabled) {
        refresh();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [enabled, onlyWhenVisible, refresh]);

  useEffect(() => {
    if (!enabled || (onlyWhenVisible && !isVisible)) return;

    // Set up interval (don't call immediately - let component control initial load)
    const intervalId = setInterval(refresh, interval);

    return () => clearInterval(intervalId);
  }, [enabled, interval, refresh, isVisible, onlyWhenVisible]);

  return { refresh };
}
