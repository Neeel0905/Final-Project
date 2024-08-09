import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '../pages/auth/layouts';
import DashboardLayout from '../pages/dashboard/layout';
import AuthGuard from './guards/auth-guard';

const Login = lazy(() => import('../pages/auth/login'));
const Signup = lazy(() => import('../pages/auth/signup'));
const ProductsList = lazy(() => import('../pages/dashboard/products'));

export default function Router() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>

        <Route
          path="dashboard"
          element={
            <AuthGuard>
              <DashboardLayout />
            </AuthGuard>
          }
        >
          <Route index element={<Navigate to="products" replace />} />
          
          <Route path="products" element={<ProductsList />} />
        </Route>

        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
}
