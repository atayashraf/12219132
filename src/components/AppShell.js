import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Sun, Moon, Link2, BarChart2 } from "lucide-react";

function ThemeToggle() {
  const [dark, setDark] = React.useState(() =>
    document.documentElement.classList.contains("dark")
  );
  React.useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);
  return (
    <button
      className="rounded-full p-2 hover:bg-muted transition-colors"
      aria-label="Toggle theme"
      onClick={() => setDark((d) => !d)}
    >
      {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}

export default function AppShell({ children }) {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <header className="sticky top-0 z-30 w-full border-b border-border bg-card/80 backdrop-blur flex items-center justify-between px-6 h-16 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="font-bold text-xl tracking-tight flex items-center gap-2">
            <Link2 className="w-6 h-6 text-primary" />
            Shorty
          </span>
          <nav className="ml-8 flex gap-2">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-md text-sm font-medium hover:bg-muted transition-colors ${location.pathname === "/" ? "bg-muted" : ""}`}
            >
              Shorten
            </Link>
            <Link
              to="/stats"
              className={`px-3 py-1.5 rounded-md text-sm font-medium hover:bg-muted transition-colors ${location.pathname === "/stats" ? "bg-muted" : ""}`}
            >
              Stats
            </Link>
          </nav>
        </div>
        <ThemeToggle />
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
} 