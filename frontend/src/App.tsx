import { Route, Routes, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import Layout from "./layout/Layout.tsx";
import Dashboard from "./pages/Dashboard";
import Loader from "./components/ui/Loader";
import { AuthProvider } from "./contexts/AuthContext";

// Pages lazy loading froom the pages folder
// Lazy loading de páginas desde la carpeta "pages"
const AuthPage = lazy(() => import("./pages/AuthPage"));
const Products = lazy(() => import("./pages/Products"));
const Categories = lazy(() => import("./pages/Categories"));
const Profile = lazy(() => import("./pages/Profile"));

const App = () => {
  return (
    <AuthProvider>
      <Layout>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/products" element={<Products />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Layout>
    </AuthProvider>
  );
};

export default App;
