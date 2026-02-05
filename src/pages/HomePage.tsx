import React from 'react';
import { Link } from 'react-router-dom';

/**
 * HomePage component displays the landing page with feature highlights
 * Apple-inspired flat design with Font Awesome icons
 * @returns The home page component
 */
export default function HomePage(): React.JSX.Element {
	return (
		<div className="min-h-screen bg-white">
			{/* Hero Section */}
			<div className="container mx-auto px-4 pt-16 pb-12 sm:pt-24 sm:pb-16">
				<div className="max-w-2xl mx-auto text-center">
					{/* Icon */}
					<div className="inline-flex items-center justify-center w-34 h-34 mb-8 bg-gray-100 rounded-3xl">
					<img src={`${import.meta.env.BASE_URL}grocery-app-logo.png`} alt="statscan-grocery-app logo" className="w-22 h-22 object-contain" />
				</div>
				<h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-slate-900 mb-5 leading-tight tracking-tight">
						Canadian Grocery
						<br />
						Price Tracker
					</h1>
					
					<p className="text-xl sm:text-2xl text-slate-600 mb-12 max-w-xl mx-auto leading-relaxed font-normal">
						Compare your grocery prices with official Statistics Canada data
					</p>

					{/* Primary CTA */}
					<Link
						to="/products"
						className="inline-flex items-center justify-center w-full sm:w-auto px-10 py-4 bg-emerald-500 text-white rounded-full text-lg font-medium hover:bg-emerald-600 active:bg-emerald-700 active:scale-[0.98] transition-all min-h-[56px] gap-2"
					>
						Browse Products
						<i className="fas fa-arrow-right" aria-hidden="true"></i>
					</Link>
				</div>
			</div>

			{/* Feature Cards */}
			<div className="container mx-auto px-4 pb-20">
				<div className="max-w-4xl mx-auto">
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
						{/* Feature 1 */}
						<div className="group bg-slate-50 rounded-3xl p-8 hover:bg-slate-100 transition-colors">
							<div className="flex sm:flex-col items-start sm:items-center gap-4 sm:gap-0">
								<div className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-blue-100 rounded-2xl sm:mb-5">
									<i className="fas fa-chart-line text-3xl text-blue-600" aria-hidden="true"></i>
								</div>
								<div className="flex-1 sm:text-center">
									<h3 className="text-xl font-semibold text-slate-900 mb-2">
										Official Data
									</h3>
									<p className="text-base text-slate-600 leading-relaxed">
										Compare with Statistics Canada pricing data
									</p>
								</div>
							</div>
						</div>

						{/* Feature 2 */}
						<div className="group bg-slate-50 rounded-3xl p-8 hover:bg-slate-100 transition-colors">
							<div className="flex sm:flex-col items-start sm:items-center gap-4 sm:gap-0">
								<div className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-red-100 rounded-2xl sm:mb-5">
									<i className="fas fa-map-marker-alt text-3xl text-red-600" aria-hidden="true"></i>
								</div>
								<div className="flex-1 sm:text-center">
									<h3 className="text-xl font-semibold text-slate-900 mb-2">
										All Provinces
									</h3>
									<p className="text-base text-slate-600 leading-relaxed">
										See regional price differences across Canada
									</p>
								</div>
							</div>
						</div>

						{/* Feature 3 */}
						<div className="group bg-slate-50 rounded-3xl p-8 hover:bg-slate-100 transition-colors">
							<div className="flex sm:flex-col items-start sm:items-center gap-4 sm:gap-0">
								<div className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-emerald-100 rounded-2xl sm:mb-5">
									<i className="fas fa-piggy-bank text-3xl text-emerald-600" aria-hidden="true"></i>
								</div>
								<div className="flex-1 sm:text-center">
									<h3 className="text-xl font-semibold text-slate-900 mb-2">
										Save Money
									</h3>
									<p className="text-base text-slate-600 leading-relaxed">
										Make informed decisions about your groceries
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}