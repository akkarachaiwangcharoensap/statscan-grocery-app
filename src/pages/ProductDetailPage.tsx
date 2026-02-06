import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { PriceRecord, ComparisonResult, Product } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductHeader from '../components/ProductHeader';
import ProductSearch from '../components/ProductSearch';
import PriceCalculator from '../components/PriceCalculator';
import { slugify, formatPrice } from '../utils';
import { useGroceryData } from '../hooks';
import { isWeightUnit, isVolumeUnit, convertPricePerUnit, formatUnit } from '../utils';
import { useLocationPreference } from '../hooks/useLocationPreference';

/**
 * ProductDetailPage component displays detailed product information and price comparison
 * Apple-inspired flat design with Font Awesome icons
 * @returns The product detail page component
 */
export default function ProductDetailPage(): React.JSX.Element {
	const { category, product: productSlug } = useParams<{ category: string; product: string }>();
	const location = useLocation();
	const productData = location.state?.product as Product | undefined;

	const { data, loading, error } = useGroceryData();
	const [product, setProduct] = useState<Product | null>(productData || null);
	const [filteredPrices, setFilteredPrices] = useState<PriceRecord[]>([]);
	const [selectedYear, setSelectedYear] = useState<string>('');
	// Location preference is global and persisted in localStorage; use a local copy so page edits don't change global
	const { location: selectedLocation } = useLocationPreference();
	const [selectedLocationLocal, setSelectedLocationLocal] = useState<string>(selectedLocation);
	useEffect(() => {
		// sync local view when global preference changes elsewhere
		setSelectedLocationLocal(selectedLocation);
	}, [selectedLocation]);
	const [selectedDisplayUnit, setSelectedDisplayUnit] = useState<string>('');
	const [displayPrice, setDisplayPrice] = useState<number | null>(null);
	const [userPrice, setUserPrice] = useState<string>('');
	const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);

	useEffect(() => {
		if (!data) return;

		const foundProduct = data.products.find(
			(p) =>
				p.product_category === category &&
				slugify(p.product_name) === productSlug
		);
		setProduct(foundProduct || null);
	}, [data, category, productSlug]);

	useEffect(() => {
		if (!data || !product) return;

		const prices = data.prices.filter(
			(p) => p.product_name === product.product_name
		);
		setFilteredPrices(prices);

		setSelectedDisplayUnit(product.product_unit);
		// do not override user's chosen location; location preference is persisted globally
		setUserPrice('');
		setComparisonResult(null);
		setDisplayPrice(null);

		if (prices.length > 0) {
			const latestYear = prices[prices.length - 1].date.substring(0, 4);
			setSelectedYear(latestYear);
		} else {
			setSelectedYear('');
		}
	}, [data, product]);

	const getAvailableYears = useCallback((): string[] => {
		const years = new Set(filteredPrices.map((p) => p.date.substring(0, 4)));
		return Array.from(years).sort();
	}, [filteredPrices]);

	const getAvailableLocations = useCallback((): string[] => {
		if (!data) return [];
		return ['Canada', ...data.locations.map((l) => l.location).filter((loc) => loc !== 'Canada')];
	}, [data]);

	const getCurrentPrice = useCallback((): number | null => {
		if (!selectedYear || !selectedLocationLocal) return null;

		const relevantPrices = filteredPrices.filter((p) => {
			const year = p.date.substring(0, 4);
			const matchesYear = year === selectedYear;
			const matchesLocation =
				selectedLocationLocal === 'Canada'
					? p.location === 'Canada'
					: p.location === selectedLocationLocal;
			return matchesYear && matchesLocation;
		});

		if (relevantPrices.length === 0) return null;

		const sum = relevantPrices.reduce((acc, p) => acc + p.price_per_unit, 0);
		return sum / relevantPrices.length;
	}, [selectedYear, selectedLocationLocal, filteredPrices]);

	useEffect(() => {
		if (!product) 
			return;

		const base = getCurrentPrice();
		if (base === null) {
			setDisplayPrice(null);
			return;
		}

		if (!selectedDisplayUnit || selectedDisplayUnit.toLowerCase() === product.product_unit.toLowerCase()) {
			setDisplayPrice(null);
			return;
		}

		try {
			const converted = convertPricePerUnit(base, product.product_unit, selectedDisplayUnit);
			setDisplayPrice(converted);
		} catch (e) {
			console.error('Unit conversion failed:', e);
			setDisplayPrice(null);
		}
	}, [getCurrentPrice, selectedDisplayUnit, product]);

	const handleCompare = useCallback((overrideUserPrice?: string) => {
		const basePrice = displayPrice !== null ? displayPrice : getCurrentPrice();
		const userPriceToUse = overrideUserPrice ?? userPrice;
		if (!basePrice || !userPriceToUse || !product) return;

		const userPriceNum = parseFloat(userPriceToUse);
		const difference = userPriceNum - basePrice;
		const percentageDifference = (difference / basePrice) * 100;

		setComparisonResult({
			userPrice: userPriceNum,
			statsCanPrice: basePrice,
			difference: Math.abs(difference),
			percentageDifference,
			isSaving: difference < 0,
			product: product.product_name,
			location: selectedLocationLocal,
			year: selectedYear,
		});
	}, [displayPrice, getCurrentPrice, userPrice, product, selectedLocationLocal, selectedYear]);

	/**
	 * Handle unit conversion with proper error handling
	 * Extracts common logic from all unit toggle buttons
	 */
	const handleUnitChange = useCallback((newUnit: string) => {
		try {
			const base = getCurrentPrice();
			if (base !== null) {
				const converted = convertPricePerUnit(base, product!.product_unit, newUnit);
				setSelectedDisplayUnit(newUnit);
				setDisplayPrice(converted);
			} else {
				setSelectedDisplayUnit(newUnit);
			}
		} catch (err) {
			console.error('Conversion error', err);
		}
	}, [getCurrentPrice, product]);

	if (loading) 
		return <LoadingSpinner message="Loading product details..." />;

	if (error) {
		return (
			<div className="min-h-screen bg-white flex items-center justify-center p-4">
				<div className="bg-red-50 rounded-3xl p-8 max-w-md w-full">
					<div className="text-center mb-4">
						<i className="fas fa-exclamation-triangle text-5xl text-red-500" aria-hidden="true"></i>
					</div>
					<p className="text-red-600 text-center font-semibold">Error loading product</p>
					<p className="text-slate-600 text-center mt-2">{error}</p>
				</div>
			</div>
		);
	}

	if (!product) {
		return (
			<div className="min-h-screen bg-white flex items-center justify-center p-4">
				<div className="bg-slate-50 rounded-3xl p-8 max-w-md w-full">
					<div className="text-center mb-4">
						<i className="fas fa-search text-5xl text-slate-300" aria-hidden="true"></i>
					</div>
					<p className="text-slate-600 text-center font-semibold">Product not found</p>
					<p className="text-sm text-slate-500 text-center mt-2">Try searching for a different product</p>
				</div>
			</div>
		);
	}

	const currentPrice = getCurrentPrice();
	const availableYears = getAvailableYears();
	const availableLocations = getAvailableLocations();

	return (
		<div className="min-h-screen bg-white pb-12">
			<div className="max-w-3xl mx-auto px-4">
				{/* Header */}
				<div className="pt-8 pb-6 sm:pt-12 sm:pb-8">
					<ProductHeader categorySlug={category || ''} categoryName={category || ''} />
				</div>

				{/* Search Bar */}
				{data && <ProductSearch products={data?.products} />}

				{/* Product Info Card */}
				<div className="bg-slate-50 rounded-3xl overflow-hidden mb-5">
					{/* Product Header */}
					<div className="p-4 sm:p-8 border-b border-slate-200">
						<div className="flex items-start justify-between gap-4 mb-6">
							<div className="flex-1 min-w-0">
								<h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 capitalize break-words mb-3 tracking-tight">
									{product.product_name}
								</h1>
								<span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-200 rounded-full capitalize">
									<i className="fas fa-tag" aria-hidden="true"></i>
									{category}
								</span>
							</div>

							{/* Unit Toggle (if weight unit) */}
							{isWeightUnit(product.product_unit.toLowerCase()) && (
								<div className="flex rounded-xl overflow-hidden bg-slate-200">
									<button
										type="button"
										aria-label="Show prices per kilogram"
										aria-pressed={(selectedDisplayUnit || product.product_unit).toLowerCase() === 'kg'}
										onClick={() => {
											const newUnit = 'kg';
											try {
												const base = getCurrentPrice();
												if (base !== null) {
													const converted = convertPricePerUnit(base, product.product_unit, newUnit);
													setSelectedDisplayUnit(newUnit);
													setDisplayPrice(converted);
												} else {
													setSelectedDisplayUnit(newUnit);
												}
											} catch (err) {
												console.error('Conversion error', err);
											}
										}}
										className={`px-5 py-3 text-sm font-bold min-w-[60px] transition-colors hover:cursor-pointer ${(selectedDisplayUnit || product.product_unit).toLowerCase() === 'kg'
												? 'bg-emerald-500 text-white'
												: 'bg-slate-200 text-slate-700 hover:bg-slate-300'
											}`}
									>
										KG
									</button>

									<button
										type="button"
										aria-label="Show prices per pound"
										aria-pressed={(selectedDisplayUnit || product.product_unit).toLowerCase() === 'lb'}
										onClick={() => {
											const newUnit = 'lb';
											try {
												const base = getCurrentPrice();
												if (base !== null) {
													const converted = convertPricePerUnit(base, product.product_unit, newUnit);
													setSelectedDisplayUnit(newUnit);
													setDisplayPrice(converted);
												} else {
													setSelectedDisplayUnit(newUnit);
												}
											} catch (err) {
												console.error('Conversion error', err);
											}
										}}
										className={`px-5 py-3 text-sm font-bold min-w-[60px] transition-colors hover:cursor-pointer ${(selectedDisplayUnit || product.product_unit).toLowerCase() === 'lb'
												? 'bg-emerald-500 text-white'
												: 'bg-slate-200 text-slate-700 hover:bg-slate-300'
											}`}
									>
										LB
									</button>
								</div>
							)}

						{/* Unit Toggle (if volume unit) */}
						{isVolumeUnit(product.product_unit.toLowerCase()) && (
							<div className="flex rounded-xl overflow-hidden bg-slate-200">
								<button
									type="button"
									aria-label="Show prices per litre"
									aria-pressed={(selectedDisplayUnit || product.product_unit).toLowerCase() === 'l'}
									onClick={() => handleUnitChange('l')}
								className={`px-5 py-3 text-sm font-bold min-w-[60px] transition-colors hover:cursor-pointer ${(selectedDisplayUnit || product.product_unit).toLowerCase() === 'l'
									? 'bg-emerald-500 text-white'
									: 'bg-slate-200 text-slate-700 hover:bg-slate-300'
								}`}
							>
								L
							</button>

							<button
								type="button"
								aria-label="Show prices per millilitre"
								aria-pressed={(selectedDisplayUnit || product.product_unit).toLowerCase() === 'ml'}
					onClick={() => handleUnitChange('ml')}
								className={`px-5 py-3 text-sm font-bold min-w-[60px] transition-colors hover:cursor-pointer ${(selectedDisplayUnit || product.product_unit).toLowerCase() === 'ml'
									? 'bg-emerald-500 text-white'
									: 'bg-slate-200 text-slate-700 hover:bg-slate-300'
								}`}
							>
								ML
							</button>

							<button
								type="button"
								aria-label="Show prices per fluid ounce"
								aria-pressed={(selectedDisplayUnit || product.product_unit).toLowerCase() === 'oz'}
								onClick={() => handleUnitChange('oz')}
								className={`px-5 py-3 text-sm font-bold min-w-[60px] transition-colors hover:cursor-pointer ${(selectedDisplayUnit || product.product_unit).toLowerCase() === 'oz'
									? 'bg-emerald-500 text-white'
									: 'bg-slate-200 text-slate-700 hover:bg-slate-300'
								}`}
							>
								OZ
							</button>
							</div>
						)}

					{!isWeightUnit(product.product_unit.toLowerCase()) && !isVolumeUnit(product.product_unit.toLowerCase()) && (
						<div className="flex items-center gap-2 px-4 py-3 bg-slate-200 rounded-xl">
									<i className="fas fa-balance-scale text-slate-700" aria-hidden="true"></i>
									<span className="text-sm font-bold text-slate-900">
										per {formatUnit(selectedDisplayUnit || product.product_unit)}
									</span>
								</div>
							)}
						</div>

						{/* Filter Controls */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div>
								<label htmlFor="location-select" className="block text-sm font-semibold text-slate-700 mb-2">
									<i className="fas fa-map-marker-alt mr-1" aria-hidden="true"></i>
									Location
								</label>
								<select
									id="location-select"
									value={selectedLocationLocal}
									onChange={(e) => setSelectedLocationLocal(e.target.value)}
									className="w-full px-4 py-3.5 text-base font-medium border-2 border-slate-300 rounded-xl bg-white hover:border-slate-400 focus:outline-none focus:border-emerald-500 transition-colors min-h-[52px]"
								>
									{availableLocations.map((loc) => (
										<option key={loc} value={loc}>{loc}</option>
									))}
								</select>
							</div>

							<div>
								<label htmlFor="year-select" className="block text-sm font-semibold text-slate-700 mb-2">
									<i className="fas fa-calendar-alt mr-1" aria-hidden="true"></i>
									Year
								</label>
								<select
									id="year-select"
									value={selectedYear}
									onChange={(e) => setSelectedYear(e.target.value)}
									className="w-full px-4 py-3.5 text-base font-medium border-2 border-slate-300 rounded-xl bg-white hover:border-slate-400 focus:outline-none focus:border-emerald-500 transition-colors min-h-[52px]"
								>
									{availableYears.map((year) => (
										<option key={year} value={year}>{year}</option>
									))}
								</select>
							</div>
						</div>
					</div>

					{/* Price Display */}
					{currentPrice !== null && (
						<div className="p-4 sm:p-8 bg-emerald-50">
							<div className="flex items-end justify-between">
								<div>
									<p className="text-xs sm:text-sm font-semibold text-emerald-800 mb-2 uppercase tracking-wide">
										<i className="fas fa-check-circle mr-1" aria-hidden="true"></i>
										Official Price
									</p>
									<div className="flex items-baseline gap-3">
										<span className="text-4xl sm:text-6xl font-semibold text-slate-900 tracking-tight">
										${formatPrice(displayPrice !== null ? displayPrice : currentPrice, { official: true })}
										</span>
										<span className="text-base sm:text-xl text-slate-600 font-medium">
											per {formatUnit(selectedDisplayUnit || product.product_unit)}
										</span>
									</div>
								</div>
								<div className="text-right">
									<p className="text-xs sm:text-sm font-semibold text-slate-900">
										<i className="fas fa-map-pin mr-1" aria-hidden="true"></i>
										{selectedLocationLocal}
									</p>
									<p className="text-xs sm:text-sm text-slate-600">{selectedYear}</p>
								</div>
							</div>
						</div>
					)}

					{/* No Data Message */}
					{!currentPrice && selectedYear && selectedLocationLocal && (
						<div className="p-4 sm:p-8 bg-yellow-50 border-t border-yellow-200">
							<div className="flex items-center gap-3">
								<i className="fas fa-exclamation-circle text-2xl text-yellow-600" aria-hidden="true"></i>
								<div>
									<p className="text-sm font-semibold text-yellow-900">
										No price data available
									</p>
									<p className="text-xs text-yellow-700 mt-0.5">
										Try selecting a different year or location
									</p>
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Price Calculator */}
				<PriceCalculator
					userPrice={userPrice}
					unit={(selectedDisplayUnit || product.product_unit)}
					currentPrice={currentPrice}
					onUserPriceChange={setUserPrice}
					onCalculate={handleCompare}
					comparisonResult={comparisonResult}
				/>
			</div>
		</div>
	);
}