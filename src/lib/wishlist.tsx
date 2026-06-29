import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type WishlistCtx = {
  ids: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
  clear: () => void;
};

const Ctx = createContext<WishlistCtx | null>(null);
const KEY = "eclat-wishlist-v1";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setIds(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(ids));
    } catch {}
  }, [ids]);

  const value = useMemo<WishlistCtx>(
    () => ({
      ids,
      toggle: (id) => setIds((curr) => (curr.includes(id) ? curr.filter((x) => x !== id) : [...curr, id])),
      has: (id) => ids.includes(id),
      clear: () => setIds([]),
    }),
    [ids],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWishlist() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useWishlist must be used within WishlistProvider");
  return c;
}
