import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, MessageCircle, Menu, X, ShoppingBag, Moon, Sun } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

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

function Header() {
  const [open, setOpen] = useState(false);
  const { dark, toggle } = useDarkMode();
  const nav = [
    { to: "/", label: "Home" },
    { to: "/collections", label: "Collections" },
    { to: "/order", label: "Order" },
  ] as const;

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 py-5">
        <div className="flex items-center">
          <button
            aria-label="Menu"
            className="md:hidden"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <nav className="hidden gap-8 text-xs uppercase tracking-luxe md:flex">
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
        </div>

        <Link to="/" className="text-center">
          <span className="font-serif text-2xl tracking-[0.4em] md:text-3xl">ÉCLAT</span>
        </Link>

        <div className="flex items-center justify-end gap-4">
          <button aria-label="Toggle theme" onClick={toggle} className="text-muted-foreground hover:text-foreground">
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <Link to="/order" aria-label="Order" className="text-muted-foreground hover:text-foreground">
            <ShoppingBag className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-background animate-fade-in md:hidden">
          <div className="flex items-center justify-between px-6 py-5">
            <span className="font-serif text-2xl tracking-[0.4em]">ÉCLAT</span>
            <button aria-label="Close" onClick={() => setOpen(false)}><X className="h-5 w-5" /></button>
          </div>
          <nav className="flex flex-col items-center gap-8 pt-16 text-sm uppercase tracking-luxe">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)}>{n.label}</Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-32 border-t border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div>
            <div className="font-serif text-2xl tracking-[0.4em]">ÉCLAT</div>
            <p className="mt-4 text-sm text-muted-foreground">
              Timeless elegance, crafted for Pakistan.
            </p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-luxe text-muted-foreground">Explore</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/" className="link-underline">Home</Link></li>
              <li><Link to="/collections" className="link-underline">Collections</Link></li>
              <li><Link to="/order" className="link-underline">Order Form</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-luxe text-muted-foreground">Connect</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li><a href="#" className="flex items-center gap-2 link-underline"><Instagram className="h-4 w-4" /> Instagram</a></li>
              <li><a href="#" className="flex items-center gap-2 link-underline"><Facebook className="h-4 w-4" /> Facebook</a></li>
              <li><a href="#" className="flex items-center gap-2 link-underline"><MessageCircle className="h-4 w-4" /> WhatsApp</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-luxe text-muted-foreground">Atelier</h4>
            <p className="mt-4 text-sm text-muted-foreground">
              Lahore · Karachi · Islamabad<br />
              hello@eclat.pk
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
