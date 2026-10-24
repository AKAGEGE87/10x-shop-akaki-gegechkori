import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { Container } from "../ui/Container";

export function Header() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
      isActive
        ? "text-indigo-600 font-semibold"
        : "text-slate-600 hover:text-slate-900"
    }`;

  const displayName = user?.firstName || user?.username;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-2 sm:gap-4">
        <Link
          to="/"
          className="shrink-0 text-lg font-bold tracking-tight text-slate-900 transition-colors hover:text-indigo-600 sm:text-xl"
        >
          10X Shop
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4 md:gap-6">
          <NavLink to="/" end className={navLinkClass}>
            Catalog
          </NavLink>

          <NavLink to="/cart" className={navLinkClass}>
            <span className="flex items-center gap-1 sm:gap-1.5">
              <span>Cart</span>
              {itemCount > 0 && (
                <span className="inline-flex h-4 min-w-4 sm:h-5 sm:min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] sm:text-xs font-semibold text-white">
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
                    <span className="hidden md:inline font-normal text-slate-500">
                      ({displayName})
                    </span>
                  )}
                </span>
              </NavLink>

              <button
                type="button"
                onClick={handleLogout}
                className="cursor-pointer rounded-lg border border-slate-200 px-2 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:px-3 sm:py-1.5 sm:text-sm"
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
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-900 text-white hover:bg-slate-800"
                }`
              }
            >
              Log in
            </NavLink>
          )}
        </nav>
      </Container>
    </header>
  );
}
