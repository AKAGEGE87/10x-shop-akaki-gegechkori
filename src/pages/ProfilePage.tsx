import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "../components/ui/Container";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";
import { ordersStorage } from "../models/ordersStorage";
import { reviewsStorage } from "../models/reviewsStorage";
import type { ProfileFormValues } from "../types/user";

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

export function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const { clearCart } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");

  const [errors, setErrors] = useState<FormErrors>({});
  const [ordersCount, setOrdersCount] = useState(
    () => ordersStorage.get()?.length || 0
  );

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};

    if (firstName.trim().length < 2) {
      nextErrors.firstName = "First name must be at least 2 characters";
    }

    if (lastName.trim().length < 2) {
      nextErrors.lastName = "Last name must be at least 2 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      nextErrors.email = "Please enter a valid email address";
    }

    if (phone.trim()) {
      const digits = phone.replace(/\D/g, "");
      const phoneRegex = /^\+?[\d\s-]{9,25}$/;
      if (!phoneRegex.test(phone.trim()) || digits.length < 9 || digits.length > 15) {
        nextErrors.phone = "Please enter a valid phone number";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const values: ProfileFormValues = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
    };

    updateProfile(values);
    showToast("Profile updated ✓", "success");
  };

  const handleClearData = () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear your local cart, orders, and reviews? Your active session will be preserved."
    );
    if (!confirmed) {
      return;
    }

    clearCart();
    ordersStorage.remove();
    reviewsStorage.remove();
    setOrdersCount(0);
    showToast("Local data cleared", "info");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");

  return (
    <Container className="py-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            My Profile
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your personal information and local preferences
          </p>
        </div>

        {/* User Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-xl font-bold text-brand-600 uppercase dark:bg-brand-950 dark:text-brand-400">
                {user?.username ? user.username.charAt(0) : "U"}
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {fullName || user?.username}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  @{user?.username}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-2 text-center sm:text-right dark:border-slate-800 dark:bg-slate-800">
              <span className="block text-xs font-medium text-slate-400 dark:text-slate-500">
                Orders placed
              </span>
              <span className="text-lg font-bold text-brand-600 dark:text-brand-400">
                {ordersCount}
              </span>
            </div>
          </div>
        </div>

        {/* Theme Preferences (P7 requirement) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Appearance & Theme
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Current theme is set to{" "}
                <span className="font-semibold text-brand-600 dark:text-brand-400 capitalize">
                  {theme}
                </span>
              </p>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme appearance"
              className="cursor-pointer inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Switch to {theme === "dark" ? "Light" : "Dark"} mode
            </button>
          </div>
        </div>

        {/* Edit Profile Form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Personal Details
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Update your contact and shipping information
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="profile-first-name"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  First name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="profile-first-name"
                  type="text"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    if (errors.firstName) {
                      setErrors((prev) => ({ ...prev, firstName: undefined }));
                    }
                  }}
                  className={`mt-1 block w-full rounded-lg border px-3.5 py-2 text-sm text-slate-900 transition focus:outline-none focus:ring-2 dark:bg-slate-800 dark:text-white ${
                    errors.firstName
                      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200"
                      : "border-slate-300 focus:border-brand-600 focus:ring-brand-200 dark:border-slate-700"
                  }`}
                  placeholder="e.g. John"
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="profile-last-name"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Last name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="profile-last-name"
                  type="text"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    if (errors.lastName) {
                      setErrors((prev) => ({ ...prev, lastName: undefined }));
                    }
                  }}
                  className={`mt-1 block w-full rounded-lg border px-3.5 py-2 text-sm text-slate-900 transition focus:outline-none focus:ring-2 dark:bg-slate-800 dark:text-white ${
                    errors.lastName
                      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200"
                      : "border-slate-300 focus:border-brand-600 focus:ring-brand-200 dark:border-slate-700"
                  }`}
                  placeholder="e.g. Doe"
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-rose-600">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="profile-email"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Email address <span className="text-rose-500">*</span>
              </label>
              <input
                id="profile-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors((prev) => ({ ...prev, email: undefined }));
                  }
                }}
                className={`mt-1 block w-full rounded-lg border px-3.5 py-2 text-sm text-slate-900 transition focus:outline-none focus:ring-2 dark:bg-slate-800 dark:text-white ${
                  errors.email
                    ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200"
                    : "border-slate-300 focus:border-brand-600 focus:ring-brand-200 dark:border-slate-700"
                }`}
                placeholder="e.g. john@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-rose-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="profile-phone"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Phone number <span className="text-xs text-slate-400">(optional)</span>
              </label>
              <input
                id="profile-phone"
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) {
                    setErrors((prev) => ({ ...prev, phone: undefined }));
                  }
                }}
                className={`mt-1 block w-full rounded-lg border px-3.5 py-2 text-sm text-slate-900 transition focus:outline-none focus:ring-2 dark:bg-slate-800 dark:text-white ${
                  errors.phone
                    ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200"
                    : "border-slate-300 focus:border-brand-600 focus:ring-brand-200 dark:border-slate-700"
                }`}
                placeholder="+995 555 12 34 56"
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-rose-600">{errors.phone}</p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="cursor-pointer rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
              >
                Save changes
              </button>
            </div>
          </form>
        </div>

        {/* Data Management & Session Actions */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Account Management
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Clear stored local browser data or sign out of your account
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleClearData}
              className="cursor-pointer rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300"
            >
              Clear local data
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="cursor-pointer rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
}
