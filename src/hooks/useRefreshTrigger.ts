import { useState, useCallback } from "react";

export function useRefreshTrigger() {
  const [trigger, setTrigger] = useState(0);

  const refresh = useCallback(() => {
    setTrigger((prev) => prev + 1);
  }, []);

  return { trigger, refresh };
}
