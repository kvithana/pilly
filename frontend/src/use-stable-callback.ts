import { useLayoutEffect, useMemo, useRef } from "react";

export function useStableCallback<T extends Function>(
  cb: T,
  deps: unknown[]
): T {
  const ref = useRef<T | undefined>(cb);

  useLayoutEffect(() => {
    ref.current = cb;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deps]);

  const stableCallback = useMemo(
    () => (...args: any[]) => ref.current!(...args),
    [ref]
  );

  return (stableCallback as any) as T;
}
