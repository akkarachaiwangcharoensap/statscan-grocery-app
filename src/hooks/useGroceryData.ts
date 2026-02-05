import { useState, useEffect } from 'react';
import { GroceryData } from '../types';
import groceryDataJson from '../data/grocery-data.json';

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
		try {
			// Use the imported JSON directly
			setData(groceryDataJson as GroceryData);
			setLoading(false);
		} catch (err: unknown) {
			if (err instanceof Error) {
				setError(err.message);
				setLoading(false);
			}
		}
	}, []);

	return { data, loading, error };
}