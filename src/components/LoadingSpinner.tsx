import type React from 'react';

interface LoadingSpinnerProps {
	message?: string;
}

/**
 * LoadingSpinner component displays a loading spinner with an optional message
 * Apple-inspired flat design with Font Awesome icon
 * @param props - Component props
 * @returns The loading spinner component
 */
export default function LoadingSpinner({ message = 'Loading...' }: LoadingSpinnerProps): React.ReactElement {
	return (
		<div className="min-h-screen bg-white flex items-center justify-center px-4">
			<div className="text-center">
				<div className="relative inline-block mb-6">
					<i className="fas fa-spinner fa-spin text-6xl text-emerald-500" aria-hidden="true"></i>
				</div>
				<p className="text-base sm:text-lg text-slate-600 font-medium">{message}</p>
			</div>
		</div>
	);
}