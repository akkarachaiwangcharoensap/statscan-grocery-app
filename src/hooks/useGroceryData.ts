import { useState, useEffect } from 'react';
import { GroceryData } from '../types';

interface UseGroceryDataResult {
	data: GroceryData | null;
	loading: boolean;
	error: string | null;
}

/**
 * Custom hook to manage grocery data
 * 
 * This is the most reliable approach for GitHub Pages deployment.
 * The data is bundled with your app, eliminating all path resolution issues.
 */
export function useGroceryData(): UseGroceryDataResult {
	const [data, setData] = useState<GroceryData | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const res = await fetch(`${import.meta.env.BASE_URL || '/'}grocery-data.json`);
				if (!res.ok) throw new Error(`Failed to fetch data: ${res.status}`);
				const json = (await res.json()) as GroceryData;
				if (mounted) {
					setData(json);
					setLoading(false);
				}
			} catch (err: unknown) {
				if (err instanceof Error && mounted) {
					setError(err.message);
					setLoading(false);
				}
			}
		})();

		return () => {
			mounted = false;
		};
	}, []);

	return { data, loading, error };
}