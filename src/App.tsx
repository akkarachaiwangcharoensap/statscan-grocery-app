import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
const HomePage = React.lazy(() => import('./pages/HomePage'));
const ProductsPage = React.lazy(() => import('./pages/ProductsPage'));
const CategoryPage = React.lazy(() => import('./pages/CategoryPage'));
const ProductDetailPage = React.lazy(() => import('./pages/ProductDetailPage'));

/**
 * Main App component with routing configuration
 * @returns The application root component
 */
function App(): React.JSX.Element {
	return (
		<Router basename={import.meta.env.BASE_URL || '/'}>
			<React.Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading…</div>}>
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/products" element={<ProductsPage />} />
					<Route path="/products/:category" element={<CategoryPage />} />
					<Route path="/products/:category/:product" element={<ProductDetailPage />} />
				</Routes>
			</React.Suspense>
		</Router>
	);
}

export default App;