import { useMemo, useState } from 'react';
import type React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductSearch from '../components/ProductSearch';
import LocationSelector from '../components/LocationSelector';
import { formatCategoryName } from '../utils';
import { useGroceryData } from '../hooks';

const categoryIcons: Record<string, { icon?: string; img?: string; colorBg: string; colorHover: string; colorIcon: string; iconColor: string }> = {
	vegetable: { img: 'vegetable.png', icon: 'fa-carrot', colorBg: 'bg-green-50', colorHover: 'hover:bg-green-100', colorIcon: 'bg-green-100', iconColor: 'text-green-600' },
	dairy_and_egg: { img: 'dairy-and-egg.png', icon: 'fa-cheese', colorBg: 'bg-yellow-50', colorHover: 'hover:bg-yellow-100', colorIcon: 'bg-yellow-100', iconColor: 'text-yellow-600' },
	fruit: { img: 'fruit.png', icon: 'fa-apple-alt', colorBg: 'bg-red-50', colorHover: 'hover:bg-red-100', colorIcon: 'bg-red-100', iconColor: 'text-red-600' },
	carbs: { img: 'carbs.png', icon: 'fa-seedling', colorBg: 'bg-stone-50', colorHover: 'hover:bg-stone-100', colorIcon: 'bg-stone-100', iconColor: 'text-stone-600' },
	canned_food: { img: 'canned-food.png', icon: 'fa-box-open', colorBg: 'bg-orange-50', colorHover: 'hover:bg-orange-100', colorIcon: 'bg-orange-100', iconColor: 'text-orange-600' },
	frozen_food: { img: 'frozen-food.png', icon: 'fa-snowflake', colorBg: 'bg-cyan-50', colorHover: 'hover:bg-cyan-100', colorIcon: 'bg-cyan-100', iconColor: 'text-cyan-600' },
	nuts_and_dry_beans: { img: 'nuts-and-dry-beans.png', icon: 'fa-peanut', colorBg: 'bg-lime-50', colorHover: 'hover:bg-lime-100', colorIcon: 'bg-lime-100', iconColor: 'text-lime-600' },
	beef: { img: 'beef.png', icon: 'fa-drumstick-bite', colorBg: 'bg-rose-50', colorHover: 'hover:bg-rose-100', colorIcon: 'bg-rose-100', iconColor: 'text-rose-600' },
	oil: { img: 'oil.png', icon: 'fa-oil-can', colorBg: 'bg-lime-50', colorHover: 'hover:bg-lime-100', colorIcon: 'bg-lime-100', iconColor: 'text-lime-600' },
	seasoning: { img: 'seasoning.png', icon: 'fa-spoon', colorBg: 'bg-pink-50', colorHover: 'hover:bg-pink-100', colorIcon: 'bg-pink-100', iconColor: 'text-pink-600' },
	seafood: { img: 'seafood.png', icon: 'fa-fish', colorBg: 'bg-blue-50', colorHover: 'hover:bg-blue-100', colorIcon: 'bg-blue-100', iconColor: 'text-blue-600' },
	pork: { img: 'pork.png', icon: 'fa-bacon', colorBg: 'bg-pink-50', colorHover: 'hover:bg-pink-100', colorIcon: 'bg-pink-100', iconColor: 'text-pink-600' },
	deli: { img: 'deli.png', icon: 'fa-drumstick-bite', colorBg: 'bg-amber-50', colorHover: 'hover:bg-amber-100', colorIcon: 'bg-amber-100', iconColor: 'text-amber-600' },
	poultry: { img: 'poultry.png', icon: 'fa-egg', colorBg: 'bg-amber-50', colorHover: 'hover:bg-amber-100', colorIcon: 'bg-amber-100', iconColor: 'text-amber-600' },
	drink: { img: 'drink.png', icon: 'fa-coffee', colorBg: 'bg-amber-50', colorHover: 'hover:bg-amber-100', colorIcon: 'bg-amber-100', iconColor: 'text-amber-600' },
	personal_care: { img: 'personal-care.png', icon: 'fa-heart', colorBg: 'bg-slate-50', colorHover: 'hover:bg-slate-100', colorIcon: 'bg-slate-100', iconColor: 'text-slate-600' },
	baby_items: { img: 'baby-items.png', icon: 'fa-baby', colorBg: 'bg-pink-50', colorHover: 'hover:bg-pink-100', colorIcon: 'bg-pink-100', iconColor: 'text-pink-600' },
	snacks: { img: 'snacks.png', icon: 'fa-cookie-bite', colorBg: 'bg-orange-50', colorHover: 'hover:bg-orange-100', colorIcon: 'bg-orange-100', iconColor: 'text-orange-600' },
	pantry_item: { img: 'pantry-items.png', icon: 'fa-box-open', colorBg: 'bg-orange-50', colorHover: 'hover:bg-orange-100', colorIcon: 'bg-orange-100', iconColor: 'text-orange-600' },
	baking_ingredients: { img: 'baking-ingredients.png', icon: 'fa-bread-slice', colorBg: 'bg-yellow-50', colorHover: 'hover:bg-yellow-100', colorIcon: 'bg-yellow-100', iconColor: 'text-yellow-600' },
	household_supply: { img: 'household-supply.png', icon: 'fa-home', colorBg: 'bg-slate-50', colorHover: 'hover:bg-slate-100', colorIcon: 'bg-slate-100', iconColor: 'text-slate-600' },
	other: { img: 'other.png', icon: 'fa-shopping-basket', colorBg: 'bg-slate-50', colorHover: 'hover:bg-slate-100', colorIcon: 'bg-slate-100', iconColor: 'text-slate-600' },
	plant_based_protein: { img: 'plant-based-protein.png', icon: 'fa-seedling', colorBg: 'bg-emerald-50', colorHover: 'hover:bg-emerald-100', colorIcon: 'bg-emerald-100', iconColor: 'text-emerald-600' },
};

function CategoryIcon({ imgName, fallbackIcon, label }: { imgName?: string; fallbackIcon?: string; label: string }): React.ReactElement {
	const [error, setError] = useState(false);

	if (imgName && !error) {
		return (
			<img
				src={`${import.meta.env.BASE_URL}categories/${imgName}`}
				alt={label}
				className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
				onError={() => setError(true)}
			/>
		);
	}

	return <i className={`fas ${fallbackIcon ?? 'fa-shopping-basket'} text-3xl sm:text-4xl`} aria-hidden="true"></i>;
}

/**
 * ProductsPage component displays all product categories with their unique product counts
 * @returns The products page component
 */
export default function ProductsPage(): React.ReactElement {
	const { data, loading, error } = useGroceryData();

	/**
	 * Calculate categories with unique product counts
	 * This ensures the count shows unique product names, not total price records
	 */
	// Desired category order & display labels (matches your list)
	const DESIRED_CATEGORIES: Array<{ key: string; label: string }> = [
		{ key: 'vegetable', label: 'Vegetables' },
		{ key: 'dairy_and_egg', label: 'Dairy And Egg' },
		{ key: 'fruit', label: 'Fruit' },
		{ key: 'carbs', label: 'Carbs' },
		{ key: 'canned_food', label: 'Canned Food' },
		{ key: 'frozen_food', label: 'Frozen Food' },
		{ key: 'nuts_and_dry_beans', label: 'Nuts & Beans' },
		{ key: 'beef', label: 'Beef' },
		{ key: 'oil', label: 'Oil' },
		{ key: 'seasoning', label: 'Seasoning' },
		{ key: 'seafood', label: 'Seafood' },
		{ key: 'pork', label: 'Pork' },
		{ key: 'deli', label: 'Deli' },
		{ key: 'poultry', label: 'Poultry' },
		{ key: 'drink', label: 'Drink' },
		{ key: 'personal_care', label: 'Personal Care' },
		{ key: 'baby_items', label: 'Baby Items' },
		{ key: 'snacks', label: 'Snacks' },
		{ key: 'pantry_item', label: 'Pantry Items' },
		{ key: 'baking_ingredients', label: 'Baking Ingredients' },
		{ key: 'household_supply', label: 'Household Supply' },
		{ key: 'other', label: 'Other' },
		{ key: 'plant_based_protein', label: 'Plant Based' },
	];

	const displayNameOverrides: Record<string, string> = Object.fromEntries(DESIRED_CATEGORIES.map((c) => [c.key, c.label]));

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

		// Build list in the requested order (fall back to any remaining categories at the end)
		const ordered = DESIRED_CATEGORIES.map((c) => ({
			name: c.key,
			count: categoryProductCounts[c.key]?.size || 0,
		}));

		// Append any categories present in data but not listed in DESIRED_CATEGORIES
		const extra = data.categories
			.map((c) => c.name)
			.filter((n) => !DESIRED_CATEGORIES.some((d) => d.key === n))
			.map((name) => ({ name, count: categoryProductCounts[name]?.size || 0 }));

		return [...ordered, ...extra];
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

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

	return (
		<div className="min-h-screen bg-white pb-12">
			<div className="max-w-6xl mx-auto px-4">
				{/* Header with back button */}
				<div className="pt-8 pb-6 sm:pt-12 sm:pb-8 flex items-center justify-between">
					<Link
						to="/"
						className="inline-flex items-center gap-2 px-4 py-2.5 text-slate-700 hover:text-slate-900 active:text-slate-900 transition-colors rounded-xl hover:bg-slate-50 active:bg-slate-100 min-h-[44px]"
					>
						<i className="fas fa-arrow-left" aria-hidden="true"></i>
						<span className="font-medium">Home</span>
					</Link>
					{/* location selector */}
					<div className="flex items-center">
						<LocationSelector />
					</div>
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

				{/* Category Grid / Loading / Empty states */}
				{loading ? (
					<div className="py-12 flex items-center justify-center">
						<LoadingSpinner message="Loading categories..." />
					</div>
				) : !data || categoriesWithProductCount.length === 0 ? (
					<div className="bg-slate-50 rounded-3xl p-8 max-w-md w-full mx-auto">
						<div className="text-center mb-4">
							<i className="fas fa-box-open text-5xl text-slate-400" aria-hidden="true"></i>
						</div>
						<p className="text-slate-600 text-center">No categories available</p>
					</div>
				) : (
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
										<CategoryIcon imgName={categoryStyle.img} fallbackIcon={categoryStyle.icon} label={`${displayNameOverrides[category.name] ?? formatCategoryName(category.name)} icon`} />
									</div>

									{/* Content */}
									<div className="flex-1 pr-20">
										<h3 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
											{displayNameOverrides[category.name] ?? formatCategoryName(category.name)}
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
				)}
			</div>
		</div>
	);
}