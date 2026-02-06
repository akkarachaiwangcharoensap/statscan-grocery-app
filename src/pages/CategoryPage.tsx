import { useState, useEffect } from 'react';
import type React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Product } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductHeader from '../components/ProductHeader';
import ProductSearch from '../components/ProductSearch';
import { slugify } from '../utils';
import { useGroceryData } from '../hooks';

/**
 * CategoryPage component displays all products within a specific category
 * Apple-inspired flat design with Font Awesome icons
 * @returns The category page component
 */
export default function CategoryPage(): React.ReactElement {
	const { category } = useParams<{ category: string }>();
	const { data, loading, error } = useGroceryData();
	const [products, setProducts] = useState<Product[]>([]);

	useEffect(() => {
		if (!data) return;

		// Filter unique products for this category
		const categoryProducts = data.products.filter(
			(p) => p.product_category === category
		);
		setProducts(categoryProducts);
	}, [data, category]);

	if (loading) return <LoadingSpinner message="Loading products..." />;

	if (error) {
		return (
			<div className="min-h-screen bg-white flex items-center justify-center p-4">
				<div className="bg-red-50 rounded-3xl p-8 max-w-md w-full">
					<div className="text-center mb-4">
						<i className="fas fa-exclamation-triangle text-5xl text-red-500" aria-hidden="true"></i>
					</div>
					<p className="text-red-600 text-center font-semibold">Error loading products</p>
					<p className="text-slate-600 text-center mt-2">{error}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-white pb-12">
			<div className="max-w-6xl mx-auto px-4">
				{/* Header */}
				<div className="pt-8 pb-6 sm:pt-12 sm:pb-8">
					<ProductHeader categorySlug="" categoryName="Categories" />
				</div>

				{/* Title Section */}
				<div className="mb-8 sm:mb-10">
					<h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-slate-900 mb-4 capitalize tracking-tight">
						{category}
					</h1>
					<p className="text-xl sm:text-2xl text-slate-600 leading-relaxed">
						Browse all {category} products and compare prices
					</p>
				</div>

				{/* Global Search Bar */}
				<ProductSearch products={data?.products} />

				{/* Products Grid */}
				{products.length === 0 ? (
					<div className="bg-slate-50 rounded-3xl p-10 text-center">
						<div className="mb-4">
							<i className="fas fa-box-open text-5xl text-slate-300" aria-hidden="true"></i>
						</div>
						<p className="text-slate-600 font-semibold text-lg">No products available in this category</p>
						<p className="text-sm text-slate-500 mt-2">Try browsing other categories</p>
					</div>
				) : (
					<>
						{/* Product count */}
						<div className="mb-5 text-base text-slate-600 font-medium">
							{products.length} {products.length === 1 ? 'product' : 'products'}
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
							{products.map((product, index) => (
								<Link
									key={index}
									to={`/products/${category}/${slugify(product.product_name)}`}
									state={{ product }}
									className="group bg-slate-50 rounded-3xl p-6 sm:p-7 hover:bg-slate-100 active:scale-[0.98] transition-all min-h-[150px] flex flex-col justify-between"
								>
									{/* Product Name */}
									<div className="flex-1">
										<h3 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors capitalize break-words leading-snug">
											{product.product_name}
										</h3>

										{/* Unit Badge */}
										<div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 rounded-full">
											<i className="fas fa-balance-scale text-xs text-slate-600" aria-hidden="true"></i>
											<span className="text-xs font-bold text-slate-700 uppercase">
												{product.product_unit}
											</span>
										</div>
									</div>

									{/* Action Footer */}
									<div className="flex items-center justify-between mt-5 pt-5 border-t border-slate-200">
										<span className="text-base font-semibold text-emerald-600 group-hover:translate-x-1 transition-transform">
											Compare Price
										</span>
										<div className="w-9 h-9 flex items-center justify-center rounded-full bg-emerald-100 group-hover:bg-emerald-200 transition-colors">
											<i className="fas fa-chevron-right text-emerald-700" aria-hidden="true"></i>
										</div>
									</div>
								</Link>
							))}
						</div>
					</>
				)}
			</div>
		</div>
	);
}