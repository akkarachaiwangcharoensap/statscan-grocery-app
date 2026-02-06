import {
	formatPrice,
	formatPriceWithSymbol,
	calculatePercentageDifference,
	arePricesEqual,
} from './priceFormatting';

describe('priceFormatting utilities', () => {
	describe('formatPrice', () => {
		test('formats very small prices with 4 decimal places', () => {
			expect(formatPrice(0.0024)).toBe('0.0024');
			expect(formatPrice(0.0099)).toBe('0.0099');
			expect(formatPrice(0.001)).toBe('0.0010');
		});

		test('formats small prices with 3 decimal places', () => {
			expect(formatPrice(0.123)).toBe('0.123');
			expect(formatPrice(0.999)).toBe('0.999');
			expect(formatPrice(0.01)).toBe('0.010');
		});

		test('formats normal prices with 2 decimal places', () => {
			expect(formatPrice(1.23)).toBe('1.23');
			expect(formatPrice(12.99)).toBe('12.99');
			expect(formatPrice(100.5)).toBe('100.50');
			expect(formatPrice(1000)).toBe('1000.00');
		});

		test('handles edge cases', () => {
			expect(formatPrice(0)).toBe('0.00');
			expect(formatPrice(1)).toBe('1.00');
			expect(formatPrice(0.1)).toBe('0.100');
		});
	});

	describe('official price formatting', () => {
		test('formats official very small prices with 5 decimal places', () => {
			expect(formatPrice(0.00242, { official: true })).toBe('0.00242');
			expect(formatPriceWithSymbol(0.00242, { official: true })).toBe('$0.00242');
			// ensure default still uses 4 decimals
			expect(formatPrice(0.00242)).toBe('0.0024');
		});
	});

	describe('formatPriceWithSymbol', () => {
		test('formats price with dollar sign', () => {
			expect(formatPriceWithSymbol(1.23)).toBe('$1.23');
			expect(formatPriceWithSymbol(0.0024)).toBe('$0.0024');
			expect(formatPriceWithSymbol(0.123)).toBe('$0.123');
		});
	});

	describe('calculatePercentageDifference', () => {
		test('calculates positive percentage difference', () => {
			expect(calculatePercentageDifference(12, 10)).toBeCloseTo(20, 6);
			expect(calculatePercentageDifference(150, 100)).toBe(50);
		});

		test('calculates negative percentage difference', () => {
			expect(calculatePercentageDifference(8, 10)).toBeCloseTo(-20, 6);
			expect(calculatePercentageDifference(75, 100)).toBe(-25);
		});

		test('returns 0 for same prices', () => {
			expect(calculatePercentageDifference(10, 10)).toBe(0);
			expect(calculatePercentageDifference(100, 100)).toBe(0);
		});

		test('handles zero base price', () => {
			expect(calculatePercentageDifference(10, 0)).toBe(0);
		});

		test('handles decimal prices', () => {
			expect(calculatePercentageDifference(1.05, 1.00)).toBeCloseTo(5, 6);
		});
	});

	describe('arePricesEqual', () => {
		test('returns true for prices within default tolerance', () => {
			expect(arePricesEqual(1.00, 1.005)).toBe(true);
			expect(arePricesEqual(10.00, 10.009)).toBe(true);
		});

		test('returns false for prices outside default tolerance', () => {
			expect(arePricesEqual(1.00, 1.02)).toBe(false);
			expect(arePricesEqual(10.00, 10.02)).toBe(false);
		});

		test('accepts custom tolerance', () => {
			expect(arePricesEqual(1.00, 1.05, 0.1)).toBe(true);
			expect(arePricesEqual(1.00, 1.15, 0.1)).toBe(false);
		});

		test('returns true for exactly equal prices', () => {
			expect(arePricesEqual(1.00, 1.00)).toBe(true);
			expect(arePricesEqual(0, 0)).toBe(true);
		});

		test('handles very small prices', () => {
			expect(arePricesEqual(0.0024, 0.0025, 0.0001)).toBe(false); // diff is 0.0001, at tolerance boundary
		expect(arePricesEqual(0.0024, 0.00245, 0.0001)).toBe(true); // diff is 0.00005, within tolerance
			expect(arePricesEqual(0.0024, 0.0030, 0.0001)).toBe(false);
		});
	});
});
