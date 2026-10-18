import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Container } from "../components/ui/Container";

interface FormErrors {
  username?: string;
  password?: string;
}

export function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};

    if (!username.trim()) {
      nextErrors.username = "Username is required";
    }

    if (!password) {
      nextErrors.password = "Password is required";
    } else if (password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    login(username.trim());

    const from =
      (location.state as { from?: { pathname?: string } } | null)?.from
        ?.pathname || "/";
    navigate(from, { replace: true });
  };

  return (
    <Container className="max-w-md py-12">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 space-y-1 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Log In
          </h1>
          <p className="text-sm text-slate-500">
            Enter your credentials to access your account
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-slate-700"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (errors.username) {
                  setErrors((prev) => ({ ...prev, username: undefined }));
                }
              }}
              className={`mt-1.5 block w-full rounded-lg border px-3.5 py-2 text-sm text-slate-900 shadow-xs transition focus:outline-none focus:ring-2 ${
                errors.username
                  ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                  : "border-slate-300 focus:border-indigo-600 focus:ring-indigo-200"
              }`}
              placeholder="e.g. emilys"
            />
            {errors.username && (
              <p className="mt-1 text-xs text-red-600">{errors.username}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) {
                  setErrors((prev) => ({ ...prev, password: undefined }));
                }
              }}
              className={`mt-1.5 block w-full rounded-lg border px-3.5 py-2 text-sm text-slate-900 shadow-xs transition focus:outline-none focus:ring-2 ${
                errors.password
                  ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                  : "border-slate-300 focus:border-indigo-600 focus:ring-indigo-200"
              }`}
              placeholder="••••••"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer mt-2 flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Log In
          </button>
        </form>

        <div className="mt-6 border-t border-slate-100 pt-4 text-center">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            &larr; Back to catalog
          </Link>
        </div>
      </div>
    </Container>
  );
}
