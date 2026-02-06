import React from 'react';
import { Link } from 'react-router-dom';
import LocationSelector from './LocationSelector';

interface ProductHeaderProps {
	categorySlug: string;
	categoryName: string;
}

/**
 * ProductHeader component displays a back navigation link
 * Apple-inspired flat design with Font Awesome icon
 * @param props - Component props
 * @returns The product header component
 */
export default function ProductHeader({ categorySlug, categoryName }: ProductHeaderProps): React.JSX.Element {
	const backPath = categorySlug ? `/products` : '/products';
	const backText = categorySlug ? 'Categories' : categoryName;

	return (
		<div className="mb-6 sm:mb-8 flex items-center justify-between">
			<div>
				<Link
					to={backPath}
					className="inline-flex items-center gap-2 px-4 py-2.5 text-slate-700 hover:text-slate-900 active:text-slate-900 transition-colors rounded-xl hover:bg-slate-50 active:bg-slate-100 min-h-[44px]"
				>
					<i className="fas fa-arrow-left" aria-hidden="true"></i>
					<span className="font-medium">{backText}</span>
				</Link>
			</div>
			<div className="flex items-center">
				{/* Location selector on the right (except on home: ProductHeader isn't used there) */}
				<LocationSelector />
			</div>
		</div>
	);
}