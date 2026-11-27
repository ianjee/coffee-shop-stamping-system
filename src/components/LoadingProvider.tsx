"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import BeanLoader from "./BeanLoader";

type Ctx = { run: <T>(fn: () => Promise<T>) => Promise<T> };
const LoadingContext = createContext<Ctx>({ run: (fn) => fn() });

/** Wrap any async action: `await run(() => fetch(...))` shows the bean while it runs. */
export const useLoader = () => useContext(LoadingContext);

export default function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState(0);
  const [navigating, setNavigating] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();
  const search = useSearchParams().toString();

  const stopNav = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setNavigating(false);
  }, []);

  const startNav = useCallback(() => {
    setNavigating(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setNavigating(false), 15000); // safety net
  }, []);

  // New page rendered -> hide the loader.
  useEffect(() => { stopNav(); }, [pathname, search, stopNav]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest?.("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.search === location.search) return;
      startNav();
    }
    // Native form posts (e.g. log out). Fetch-based forms have no action and use run().
    function onSubmit(e: SubmitEvent) {
      const form = e.target as HTMLFormElement;
      if (form.getAttribute("action")) startNav();
    }
    // Capture phase: Next's <Link> calls preventDefault, so we must see the click first.
    document.addEventListener("click", onClick, true);
    document.addEventListener("submit", onSubmit, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("submit", onSubmit, true);
    };
  }, [startNav]);

  const run = useCallback(async <T,>(fn: () => Promise<T>) => {
    setCount((c) => c + 1);
    try { return await fn(); } finally { setCount((c) => c - 1); }
  }, []);

  return (
    <LoadingContext.Provider value={{ run }}>
      {children}
      {(count > 0 || navigating) && (
        <div className="loading-overlay"><BeanLoader /></div>
      )}
    </LoadingContext.Provider>
  );
}
