import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Sun, Moon, Link2 } from "lucide-react";

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
      className="theme-toggle"
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
    <div className="app-shell">
      <header className="app-header">
        <div className="flex items-center gap-4">
          <span className="header-title">
            <Link2 className="w-6 h-6 text-primary" />
            Shorty
          </span>
          <nav className="header-nav">
            <Link
              to="/"
              className={`header-link${location.pathname === "/" ? " active" : ""}`}
            >
              Shorten
            </Link>
            <Link
              to="/stats"
              className={`header-link${location.pathname === "/stats" ? " active" : ""}`}
            >
              Stats
            </Link>
          </nav>
        </div>
        <ThemeToggle />
      </header>
      <main className="main-content">{children}</main>
    </div>
  );
} 