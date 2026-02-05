import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductSearch from '../components/ProductSearch';
import { useGroceryData } from '../hooks';

const categoryIcons: Record<string, { icon: string; colorBg: string; colorHover: string; colorIcon: string; iconColor: string }> = {
	beef: { icon: 'fa-drumstick-bite', colorBg: 'bg-rose-50', colorHover: 'hover:bg-rose-100', colorIcon: 'bg-rose-100', iconColor: 'text-rose-600' },
	pork: { icon: 'fa-bacon', colorBg: 'bg-pink-50', colorHover: 'hover:bg-pink-100', colorIcon: 'bg-pink-100', iconColor: 'text-pink-600' },
	poultry: { icon: 'fa-egg', colorBg: 'bg-amber-50', colorHover: 'hover:bg-amber-100', colorIcon: 'bg-amber-100', iconColor: 'text-amber-600' },
	fish: { icon: 'fa-fish', colorBg: 'bg-blue-50', colorHover: 'hover:bg-blue-100', colorIcon: 'bg-blue-100', iconColor: 'text-blue-600' },
	seafood: { icon: 'fa-shrimp', colorBg: 'bg-cyan-50', colorHover: 'hover:bg-cyan-100', colorIcon: 'bg-cyan-100', iconColor: 'text-cyan-600' },
	fruit: { icon: 'fa-apple-alt', colorBg: 'bg-red-50', colorHover: 'hover:bg-red-100', colorIcon: 'bg-red-100', iconColor: 'text-red-600' },
	vegetable: { icon: 'fa-carrot', colorBg: 'bg-green-50', colorHover: 'hover:bg-green-100', colorIcon: 'bg-green-100', iconColor: 'text-green-600' },
	dairy: { icon: 'fa-cheese', colorBg: 'bg-yellow-50', colorHover: 'hover:bg-yellow-100', colorIcon: 'bg-yellow-100', iconColor: 'text-yellow-600' },
	eggs: { icon: 'fa-egg', colorBg: 'bg-orange-50', colorHover: 'hover:bg-orange-100', colorIcon: 'bg-orange-100', iconColor: 'text-orange-600' },
	bread: { icon: 'fa-bread-slice', colorBg: 'bg-amber-50', colorHover: 'hover:bg-amber-100', colorIcon: 'bg-amber-100', iconColor: 'text-amber-600' },
	pasta: { icon: 'fa-pizza-slice', colorBg: 'bg-yellow-50', colorHover: 'hover:bg-yellow-100', colorIcon: 'bg-yellow-100', iconColor: 'text-yellow-600' },
	rice: { icon: 'fa-seedling', colorBg: 'bg-stone-50', colorHover: 'hover:bg-stone-100', colorIcon: 'bg-stone-100', iconColor: 'text-stone-600' },
	cereal: { icon: 'fa-cookie-bite', colorBg: 'bg-orange-50', colorHover: 'hover:bg-orange-100', colorIcon: 'bg-orange-100', iconColor: 'text-orange-600' },
	oil: { icon: 'fa-oil-can', colorBg: 'bg-lime-50', colorHover: 'hover:bg-lime-100', colorIcon: 'bg-lime-100', iconColor: 'text-lime-600' },
	sugar: { icon: 'fa-candy-cane', colorBg: 'bg-pink-50', colorHover: 'hover:bg-pink-100', colorIcon: 'bg-pink-100', iconColor: 'text-pink-600' },
	coffee: { icon: 'fa-coffee', colorBg: 'bg-amber-50', colorHover: 'hover:bg-amber-100', colorIcon: 'bg-amber-100', iconColor: 'text-amber-600' },
	tea: { icon: 'fa-mug-hot', colorBg: 'bg-green-50', colorHover: 'hover:bg-green-100', colorIcon: 'bg-green-100', iconColor: 'text-green-600' },
	juice: { icon: 'fa-glass-whiskey', colorBg: 'bg-orange-50', colorHover: 'hover:bg-orange-100', colorIcon: 'bg-orange-100', iconColor: 'text-orange-600' },
	soft_drinks: { icon: 'fa-wine-bottle', colorBg: 'bg-red-50', colorHover: 'hover:bg-red-100', colorIcon: 'bg-red-100', iconColor: 'text-red-600' },
	other: { icon: 'fa-shopping-basket', colorBg: 'bg-slate-50', colorHover: 'hover:bg-slate-100', colorIcon: 'bg-slate-100', iconColor: 'text-slate-600' },
};

/**
 * ProductsPage component displays all product categories with their unique product counts
 * @returns The products page component
 */
export default function ProductsPage(): React.JSX.Element {
	const { data, loading, error } = useGroceryData();

	/**
	 * Calculate categories with unique product counts
	 * This ensures the count shows unique product names, not total price records
	 */
	const categoriesWithProductCount = useMemo<Category[]>(() => {
		if (!data) return [];

		// Count unique products per category
		const categoryProductCounts = data.products.reduce<Record<string, Set<string>>>(
			(acc, product) => {
				if (!acc[product.product_category]) {
					acc[product.product_category] = new Set();
				}
				acc[product.product_category].add(product.product_name);
				return acc;
			},
			{}
		);

		// Convert to Category array with counts
		return data.categories.map((category) => ({
			name: category.name,
			count: categoryProductCounts[category.name]?.size || 0,
		}));
	}, [data]);

	if (loading) return <LoadingSpinner message="Loading categories..." />;

	if (error) {
		return (
			<div className="min-h-screen bg-white flex items-center justify-center p-4">
				<div className="bg-red-50 rounded-3xl p-8 max-w-md w-full">
					<div className="text-center mb-4">
						<i className="fas fa-exclamation-triangle text-5xl text-red-500" aria-hidden="true"></i>
					</div>
					<p className="text-red-600 text-center font-semibold">Error loading data</p>
					<p className="text-slate-600 text-center mt-2">{error}</p>
				</div>
			</div>
		);
	}

	if (!data || categoriesWithProductCount.length === 0) {
		return (
			<div className="min-h-screen bg-white flex items-center justify-center p-4">
				<div className="bg-slate-50 rounded-3xl p-8 max-w-md w-full">
					<div className="text-center mb-4">
						<i className="fas fa-box-open text-5xl text-slate-400" aria-hidden="true"></i>
					</div>
					<p className="text-slate-600 text-center">No categories available</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-white pb-12">
			<div className="max-w-6xl mx-auto px-4">
				{/* Header with back button */}
				<div className="pt-8 pb-6 sm:pt-12 sm:pb-8">
					<Link
						to="/"
						className="inline-flex items-center gap-2 px-4 py-2.5 text-slate-700 hover:text-slate-900 active:text-slate-900 transition-colors rounded-xl hover:bg-slate-50 active:bg-slate-100 min-h-[44px]"
					>
						<i className="fas fa-arrow-left" aria-hidden="true"></i>
						<span className="font-medium">Home</span>
					</Link>
				</div>

				{/* Title Section */}
				<div className="mb-8 sm:mb-10">
					<h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-slate-900 mb-4 tracking-tight">
						Product Categories
					</h1>
					<p className="text-xl sm:text-2xl text-slate-600 leading-relaxed">
						Browse products by category and compare prices across Canada
					</p>
				</div>

				{/* Search Component */}
				<ProductSearch products={data?.products} />

				{/* Category Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{categoriesWithProductCount.map((category) => {
						const categoryStyle = categoryIcons[category.name] || categoryIcons.other;

						return (
							<Link
								key={category.name}
								to={`/products/${category.name}`}
								className={`group relative ${categoryStyle.colorBg} rounded-3xl p-6 sm:p-7 ${categoryStyle.colorHover} active:scale-[0.98] transition-all min-h-[140px] flex flex-col`}
							>
								{/* Icon badge */}
								<div className={`absolute top-5 right-5 w-14 h-14 sm:w-16 sm:h-16 ${categoryStyle.colorIcon} rounded-2xl flex items-center justify-center`}>
									<i className={`fas ${categoryStyle.icon} text-3xl sm:text-4xl ${categoryStyle.iconColor}`} aria-hidden="true"></i>
								</div>

								{/* Content */}
								<div className="flex-1 pr-20">
									<h3 className="text-2xl sm:text-3xl font-semibold text-slate-900 capitalize mb-2 group-hover:text-emerald-600 transition-colors">
										{category.name}
									</h3>
									<p className="text-base sm:text-lg text-slate-600 font-medium">
										{category.count} {category.count === 1 ? 'product' : 'products'}
									</p>
								</div>

								{/* Arrow indicator */}
								<div className="flex items-center text-emerald-600 font-semibold text-base mt-5 group-hover:translate-x-1 transition-transform">
									View Products
									<i className="fas fa-chevron-right ml-2" aria-hidden="true"></i>
								</div>
							</Link>
						);
					})}
				</div>
			</div>
		</div>
	);
}