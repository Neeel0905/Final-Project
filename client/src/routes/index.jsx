import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import AuthLayout from '../pages/auth/layouts';
import DashboardLayout from '../pages/dashboard/layout';
import AuthGuard from './guards/auth-guard';

const Login = lazy(() => import('../pages/auth/login'));
const Signup = lazy(() => import('../pages/auth/signup'));
const ProductsList = lazy(() => import('../pages/dashboard/products'));
const ProductDetails = lazy(() => import('../pages/dashboard/product-details'));
const Cart = lazy(() => import('../pages/dashboard/cart'));
const Checkout = lazy(() => import('../pages/dashboard/checkout'));
const AdminPage = lazy(() => import('../pages/dashboard/admin'));
const EditProductPage = lazy(() => import('../pages/dashboard/EditProductPage'));
const HomePage = lazy(() => import('../pages/dashboard/home'));

export default function Router() {
  return (
    <Suspense fallback={<div className='flex items-center justify-center h-screen bg-slate-900 w-screen'><Spin size="large" /></div>}>
      <Routes>
        <Route index element={<Navigate to="/dashboard/home" replace />} />
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
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<HomePage />} />
          <Route path="edit-product" element={<EditProductPage />} />
          <Route path="products" element={<ProductsList />} />
          <Route path="cart" element={<Cart />} />
          <Route path="admin" element={<AdminPage />} />
          <Route path="cart/checkout" element={<Checkout />} />
          <Route path="product-details" element={<ProductDetails />} />
        </Route>

        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
}
