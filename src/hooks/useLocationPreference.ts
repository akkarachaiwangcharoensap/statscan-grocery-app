import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'statscan_selected_location';
const DEFAULT = 'Canada';

export function useLocationPreference() {
	const [location, setLocation] = useState<string>(() => {
		try {
			const v = localStorage.getItem(STORAGE_KEY);
			return v || DEFAULT;
		} catch {
			// If localStorage isn't available for any reason, fall back to default silently
			return DEFAULT;
		}
	});

	// persist to localStorage and notify other windows/tabs and same-window listeners
	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, location);
			// inform other same-window hook instances
			if (typeof window !== 'undefined') {
				window.dispatchEvent(new CustomEvent('statscan_location_change', { detail: location }));
			}
		} catch {
			// ignore errors setting localStorage (read-only environments, etc.)
		}
	}, [location]);

	// sync across tabs and same-window custom events
	useEffect(() => {
		function onStorage(e: StorageEvent) {
			if (e.key === STORAGE_KEY && typeof e.newValue === 'string') {
				setLocation(e.newValue);
			}
		}

		function onCustom(e: Event) {
			const ce = e as CustomEvent<string>;
			if (ce?.detail && ce.detail !== location) {
				setLocation(ce.detail);
			}
		}

		window.addEventListener('storage', onStorage);
		window.addEventListener('statscan_location_change', onCustom as EventListener);
		return () => {
			window.removeEventListener('storage', onStorage);
			window.removeEventListener('statscan_location_change', onCustom as EventListener);
		};
	}, [location]);

	const set = useCallback((v: string) => setLocation(v), []);

	return { location, setLocation: set };
}
