import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const CartPage = lazy(() => import('./pages/CartPage').then((module) => ({ default: module.CartPage })));
const AdminLoginPage = lazy(() =>
  import('./pages/AdminLoginPage').then((module) => ({ default: module.AdminLoginPage })),
);
const AdminDashboardPage = lazy(() =>
  import('./pages/AdminDashboardPage').then((module) => ({ default: module.AdminDashboardPage })),
);
const AdminCategoriesPage = lazy(() =>
  import('./pages/AdminCategoriesPage').then((module) => ({ default: module.AdminCategoriesPage })),
);
const AdminHeroPage = lazy(() =>
  import('./pages/AdminHeroPage').then((module) => ({ default: module.AdminHeroPage })),
);
const AdminSettlementsPage = lazy(() =>
  import('./pages/AdminSettlementsPage').then((module) => ({ default: module.AdminSettlementsPage })),
);
const AdminProductsPage = lazy(() =>
  import('./pages/AdminProductsPage').then((module) => ({ default: module.AdminProductsPage })),
);
const AdminCustomizerPage = lazy(() =>
  import('./pages/AdminCustomizerPage').then((module) => ({ default: module.AdminCustomizerPage })),
);
const CheckoutPage = lazy(() =>
  import('./pages/CheckoutPage').then((module) => ({ default: module.CheckoutPage })),
);
const CollectionsPage = lazy(() =>
  import('./pages/CollectionsPage').then((module) => ({ default: module.CollectionsPage })),
);
const HomePage = lazy(() => import('./pages/HomePage').then((module) => ({ default: module.HomePage })));
const LoadingPage = lazy(() =>
  import('./pages/LoadingPage').then((module) => ({ default: module.LoadingPage })),
);
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })),
);
const ProductPage = lazy(() =>
  import('./pages/ProductPage').then((module) => ({ default: module.ProductPage })),
);
const ProfilePage = lazy(() =>
  import('./pages/ProfilePage').then((module) => ({ default: module.ProfilePage })),
);
const ShopPage = lazy(() => import('./pages/ShopPage').then((module) => ({ default: module.ShopPage })));
const WishlistPage = lazy(() =>
  import('./pages/WishlistPage').then((module) => ({ default: module.WishlistPage })),
);

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="min-h-screen bg-[#fcf9f3]" />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/index.html" element={<HomePage />} />
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/categories" element={<AdminCategoriesPage />} />
          <Route path="/admin/customizer" element={<AdminCustomizerPage />} />
          <Route path="/admin/hero" element={<AdminHeroPage />} />
          <Route path="/admin/products/*" element={<AdminProductsPage />} />
          <Route path="/admin/settlements" element={<AdminSettlementsPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/shop.html" element={<ShopPage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/collections.html" element={<CollectionsPage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/product.html" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/cart.html" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/wishlist.html" element={<WishlistPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/checkout.html" element={<CheckoutPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile.html" element={<ProfilePage />} />
          <Route path="/loading" element={<LoadingPage />} />
          <Route path="/loading.html" element={<LoadingPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
