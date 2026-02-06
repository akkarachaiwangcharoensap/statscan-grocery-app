/**
 * Price formatting utilities to handle various price ranges with appropriate precision
 * Avoids rounding errors by using dynamic decimal places based on the price magnitude
 */

/**
 * Format a price with dynamic decimal places to maintain readability across different price ranges
 * - Very small prices (< 0.01): Show 4 decimal places
 * - Small prices (< 1): Show 3 decimal places  
 * - Normal prices (>= 1): Show 2 decimal places
 * 
 * @param price - The price to format
 * @returns Formatted price string without dollar sign
 */
export function formatPrice(price: number, options?: { official?: boolean }): string {
	// Handle zero explicitly
	if (price === 0) {
		return '0.00';
	}
	
	if (price < 0.01) {
		// For very small prices like ML conversions, show 4 decimals by default
		// Official prices (StatsCan) should preserve an extra digit for conversions
		return options && options.official ? price.toFixed(5) : price.toFixed(4);
	}
	if (price < 1) {
		// For small prices, show 3 decimals
		return price.toFixed(3);
	}
	// For normal prices, show 2 decimals
	return price.toFixed(2);
}

/**
 * Format a price for display with dollar sign
 * @param price - The price to format
 * @returns Formatted price string with dollar sign
 */
export function formatPriceWithSymbol(price: number, options?: { official?: boolean }): string {
	return `$${formatPrice(price, options)}`;
}

/**
 * Calculate percentage difference between two prices
 * @param userPrice - The user's price
 * @param basePrice - The base/reference price
 * @returns Percentage difference (positive means user price is higher)
 */
export function calculatePercentageDifference(userPrice: number, basePrice: number): number {
	if (basePrice === 0) return 0;
	return ((userPrice - basePrice) / basePrice) * 100;
}

/**
 * Check if two prices are effectively the same (within tolerance)
 * @param price1 - First price
 * @param price2 - Second price
 * @param tolerance - Tolerance threshold (default 0.01)
 * @returns True if prices are within tolerance
 */
export function arePricesEqual(price1: number, price2: number, tolerance = 0.01): boolean {
	return Math.abs(price1 - price2) < tolerance;
}
