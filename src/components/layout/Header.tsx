import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useTheme } from "../../context/ThemeContext";
import { Container } from "../ui/Container";

export function Header() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
      isActive
        ? "text-brand-600 dark:text-brand-400 font-semibold"
        : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
    }`;

  const displayName = user?.firstName || user?.username;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900/95">
      <Container className="flex h-16 items-center justify-between gap-2 sm:gap-4">
        <Link
          to="/"
          className="shrink-0 text-lg font-bold tracking-tight text-slate-900 transition-colors hover:text-brand-600 sm:text-xl dark:text-white dark:hover:text-brand-400"
        >
          10X Shop
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3 md:gap-5">
          <NavLink to="/" end className={navLinkClass}>
            Catalog
          </NavLink>

          <NavLink to="/cart" className={navLinkClass}>
            <span className="flex items-center gap-1 sm:gap-1.5">
              <span>Cart</span>
              {itemCount > 0 && (
                <span className="inline-flex h-4 min-w-4 sm:h-5 sm:min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] sm:text-xs font-semibold text-white">
                  {itemCount}
                </span>
              )}
            </span>
          </NavLink>

          {user?.isLoggedIn ? (
            <>
              <NavLink to="/orders" className={navLinkClass}>
                Orders
              </NavLink>

              <NavLink to="/profile" className={navLinkClass}>
                <span className="flex items-center gap-1">
                  <span>Profile</span>
                  {displayName && (
                    <span className="hidden md:inline font-normal text-slate-500 dark:text-slate-400">
                      ({displayName})
                    </span>
                  )}
                </span>
              </NavLink>

              <button
                type="button"
                onClick={handleLogout}
                className="cursor-pointer rounded-lg border border-slate-200 px-2 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 sm:px-3 sm:py-1.5 sm:text-sm dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                Log out
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `rounded-lg px-2.5 py-1 text-xs font-medium transition sm:px-3.5 sm:py-1.5 sm:text-sm ${
                  isActive
                    ? "bg-brand-600 text-white"
                    : "bg-slate-900 text-white hover:bg-slate-800 dark:bg-brand-600 dark:hover:bg-brand-700"
                }`
              }
            >
              Log in
            </NavLink>
          )}

          {/* Theme Switcher Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            className="cursor-pointer rounded-lg border border-slate-200 p-1.5 text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            {theme === "dark" ? (
              <svg
                className="h-4 w-4 text-amber-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg
                className="h-4 w-4 text-slate-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>
        </nav>
      </Container>
    </header>
  );
}
