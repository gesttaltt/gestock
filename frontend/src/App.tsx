/*
 App.tsx
*/
import React, { Suspense, lazy } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Layout from "./layout/Layout";
import Dashboard from "./pages/Dashboard";
import Loader from "./components/ui/Loader";
import { AuthProvider } from "./contexts/AuthContext";

// Lazy load pages from the pages folder
const AuthPage = lazy(() => import("./pages/AuthPage"));
const Products = lazy(() => import("./pages/Products"));
const Categories = lazy(() => import("./pages/Categories"));
const Profile = lazy(() => import("./pages/Profile"));
const Customers = lazy(() => import("./pages/Customers"));

const App: React.FC = () => {
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
            <Route path="/clientes" element={<Customers />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Layout>
    </AuthProvider>
  );
};

export default App;
