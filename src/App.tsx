import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CategoryPage from './pages/CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';

/**
 * Main App component with routing configuration
 * @returns The application root component
 */
function App(): React.JSX.Element {
	return (
		<Router basename={import.meta.env.BASE_URL || '/'}>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/products" element={<ProductsPage />} />
				<Route path="/products/:category" element={<CategoryPage />} />
				<Route path="/products/:category/:product" element={<ProductDetailPage />} />
			</Routes>
		</Router>
	);
}

export default App;