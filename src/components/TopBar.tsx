import React from 'react';
import { Link } from 'react-router-dom';
import LocationSelector from './LocationSelector';

export default function TopBar(): React.JSX.Element {
	return (
		<header className="w-full flex items-center justify-between py-3 px-4">
			<Link to="/" className="inline-flex items-center gap-3">
				<img src={`${import.meta.env.BASE_URL}grocery-app-logo.png`} alt="logo" className="w-8 h-8 object-contain" />
				<span className="text-lg font-semibold text-slate-900">Canadian Grocery</span>
			</Link>
			<div className="flex items-center">
				<LocationSelector />
			</div>
		</header>
	);
}
