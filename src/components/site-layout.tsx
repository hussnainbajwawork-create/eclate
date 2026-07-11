import { Link, useRouterState } from "@tanstack/react-router";
import {
  Instagram,
  Facebook,
  MessageCircle,
  Menu,
  X,
  ShoppingBag,
  Moon,
  Sun,
  Heart,
  User,
  Search,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { useAuth } from "@/lib/auth-context";
import { INSTAGRAM_URL, FACEBOOK_URL } from "@/lib/format";

function useDarkMode() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("eclat-theme");
    const isDark = saved === "dark";
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("eclat-theme", next ? "dark" : "light");
  };
  return { dark, toggle };
}

const nav = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/handbags", label: "Handbags" },
  { to: "/shoes", label: "Shoes" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

function Header() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { dark, toggle } = useDarkMode();
  const { count } = useCart();
  const { ids } = useWishlist();
  const { user, isAdmin } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-6 py-5">
          <div className="flex items-center gap-4">
            <button aria-label="Menu" className="md:hidden" onClick={() => setOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <Link to="/" className="flex items-center">
              <img src="/logo.png" alt="ÉCLAT" className="h-8 md:h-12 w-auto object-contain dark:invert" />
            </Link>
          </div>

          <div className="flex items-center gap-8">
            <nav className="hidden gap-7 text-xs uppercase tracking-luxe md:flex">
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  className="link-underline hover:text-foreground"
                  activeProps={{ className: "text-foreground" }}
                  inactiveProps={{ className: "text-muted-foreground" }}
                >
                  {n.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4 md:border-l md:border-border/40 md:pl-8">
              <button
                aria-label="Search"
                onClick={() => setSearchOpen(true)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Search className="h-4 w-4" />
              </button>
              <button aria-label="Toggle theme" onClick={toggle} className="text-muted-foreground hover:text-foreground">
                {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <Link
                to="/wishlist"
                aria-label="Wishlist"
                className="relative text-muted-foreground hover:text-foreground"
              >
                <Heart className="h-4 w-4" />
                {ids.length > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-medium text-accent-foreground">
                    {ids.length}
                  </span>
                )}
              </Link>
              <Link to="/cart" aria-label="Cart" className="relative text-muted-foreground hover:text-foreground">
                <ShoppingBag className="h-4 w-4" />
                {count > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-medium text-accent-foreground">
                    {count}
                  </span>
                )}
              </Link>
              <Link
                to={user ? (isAdmin ? "/admin" : "/account") : "/auth"}
                aria-label="Account"
                className="text-muted-foreground hover:text-foreground"
              >
                <User className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-background animate-fade-in md:hidden">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-border/60 px-6 py-5">
            <span />
            <img src="/logo.png" alt="ÉCLAT" className="h-8 w-auto object-contain justify-self-center dark:invert" />
            <button aria-label="Close" onClick={() => setOpen(false)} className="justify-self-end">
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-1 flex-col items-center gap-7 pt-16 text-sm uppercase tracking-luxe">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)}>
                {n.label}
              </Link>
            ))}
            <Link to="/cart" onClick={() => setOpen(false)}>
              Cart ({count})
            </Link>
            <Link to="/wishlist" onClick={() => setOpen(false)}>
              Wishlist
            </Link>
            <Link to={user ? "/account" : "/auth"} onClick={() => setOpen(false)}>
              {user ? "Account" : "Sign In"}
            </Link>
            {isAdmin && (
              <Link to="/admin" onClick={() => setOpen(false)}>
                Admin
              </Link>
            )}
          </nav>
        </div>
      )}

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  );
}

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const state = useRouterState();
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.location.pathname]);
  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-background/95 backdrop-blur-md animate-fade-in">
      <div className="flex items-center justify-end px-6 py-5">
        <button onClick={onClose} aria-label="Close search">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="mx-auto w-full max-w-2xl px-6">
        <form
          action="/shop"
          className="flex items-center gap-3 border-b border-border pb-3"
          onSubmit={() => onClose()}
        >
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            name="q"
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search for a piece…"
            className="flex-1 bg-transparent py-2 font-serif text-3xl outline-none placeholder:text-muted-foreground/60"
          />
        </form>
        <p className="mt-4 text-xs uppercase tracking-luxe text-muted-foreground">
          Press Enter to search the boutique
        </p>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-32 border-t border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div>
            <img src="/logo.png" alt="ÉCLAT" className="h-10 w-auto object-contain mb-4 dark:invert" />
            <p className="mt-4 text-sm text-muted-foreground">Timeless elegance, crafted for Pakistan.</p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-luxe text-muted-foreground">Explore</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/shop" className="link-underline">Shop All</Link></li>
              <li><Link to="/handbags" className="link-underline">Handbags</Link></li>
              <li><Link to="/shoes" className="link-underline">Shoes</Link></li>
              <li><Link to="/about" className="link-underline">About</Link></li>
              <li><Link to="/contact" className="link-underline">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-luxe text-muted-foreground">Connect</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2 link-underline">
                  <Instagram className="h-4 w-4" /> Instagram
                </a>
              </li>
              <li>
                <a href={FACEBOOK_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2 link-underline">
                  <Facebook className="h-4 w-4" /> Facebook
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-luxe text-muted-foreground">Atelier</h4>
            <p className="mt-4 text-sm text-muted-foreground">
              Lahore · Karachi · Islamabad<br />
              hello@eclat.pk<br />
              +92 322 7505007
            </p>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground md:flex-row">
          <span>© {new Date().getFullYear()} ÉCLAT Maison. All rights reserved.</span>
          <span className="tracking-luxe uppercase">Handcrafted in Pakistan</span>
        </div>
      </div>
    </footer>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
