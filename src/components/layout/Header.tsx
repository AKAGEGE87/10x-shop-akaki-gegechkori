import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Container } from "../ui/Container";

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive
        ? "text-indigo-600 font-semibold"
        : "text-slate-600 hover:text-slate-900"
    }`;

  const cartItemCount = 0;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          to="/"
          className="text-xl font-bold tracking-tight text-slate-900 transition-colors hover:text-indigo-600"
        >
          10X Shop
        </Link>

        <nav className="flex items-center gap-4 sm:gap-6">
          <NavLink to="/" end className={navLinkClass}>
            Catalog
          </NavLink>

          <NavLink to="/cart" className={navLinkClass}>
            <span className="flex items-center gap-1.5">
              <span>Cart</span>
              {cartItemCount > 0 && (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-xs font-semibold text-white">
                  {cartItemCount}
                </span>
              )}
            </span>
          </NavLink>

          {user?.isLoggedIn ? (
            <div className="flex items-center gap-3">
              <span className="hidden text-sm font-medium text-slate-700 sm:inline-block">
                {user.username}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="cursor-pointer rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Log out
              </button>
            </div>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `rounded-lg px-3.5 py-1.5 text-sm font-medium transition ${
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
