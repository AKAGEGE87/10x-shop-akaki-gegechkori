import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ScrollToTop } from "./components/ui/ScrollToTop";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import { AppRoutes } from "./routes/AppRoutes";

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <ScrollToTop />
            <AppRoutes />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
