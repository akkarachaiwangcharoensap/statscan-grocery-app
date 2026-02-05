import { useState, useEffect } from 'react';
import { GroceryData } from '../types';

interface UseGroceryDataResult {
	data: GroceryData | null;
	loading: boolean;
	error: string | null;
}

/**
 * Custom hook to fetch and manage grocery data
 * Handles data fetching, loading states, and error handling
 * @returns Object containing data, loading, and error states
 */
export function useGroceryData(): UseGroceryDataResult {
	const [data, setData] = useState<GroceryData | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const controller = new AbortController();

		fetch(`${process.env.PUBLIC_URL}/data/grocery-data.json`, {
			signal: controller.signal,
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error(`Failed to load data: ${response.statusText}`);
				}
				return response.json();
			})
			.then((jsonData: GroceryData) => {
				setData(jsonData);
				setLoading(false);
			})
			.catch((err: unknown) => {
				if (err instanceof Error && err.name !== 'AbortError') {
					setError(err.message);
					setLoading(false);
				}
			});

		return () => controller.abort();
	}, []);

	return { data, loading, error };
}
