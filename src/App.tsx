import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import { ScrollToTop } from "./components/ui/ScrollToTop";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import { AppRoutes } from "./routes/AppRoutes";

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <ScrollToTop />
              <AppRoutes />
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
