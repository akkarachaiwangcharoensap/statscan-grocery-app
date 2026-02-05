import {
	convertWeight,
	convertVolume,
	isWeightUnit,
	isVolumeUnit,
	convertPricePerUnit,
	formatUnit,
} from './unitConversion';

describe('unitConversion utilities', () => {
	describe('convertWeight', () => {
		test('converts kg to lb', () => {
			expect(convertWeight(1, 'kg', 'lb')).toBeCloseTo(2.20462, 4);
		});

		test('converts lb to kg', () => {
			expect(convertWeight(1, 'lb', 'kg')).toBeCloseTo(0.45359237, 6);
		});

		test('converts grams to kilograms', () => {
			expect(convertWeight(1000, 'g', 'kg')).toBe(1);
		});

		test('converts kilograms to grams', () => {
			expect(convertWeight(1, 'kg', 'g')).toBe(1000);
		});

		test('handles case-insensitive units', () => {
			const result1 = convertWeight(1, 'KG', 'LB');
			const result2 = convertWeight(1, 'kg', 'lb');
			expect(result1).toBeCloseTo(result2, 4);
		});

		test('throws error for invalid weight unit', () => {
			expect(() => convertWeight(1, 'invalid', 'kg')).toThrow('Invalid weight unit');
		});

		test('throws error when converting between incompatible units', () => {
			expect(() => convertWeight(1, 'kg', 'l')).toThrow('Invalid weight unit');
		});

		test('handles zero values', () => {
			expect(convertWeight(0, 'kg', 'lb')).toBe(0);
		});

		test('handles decimal values', () => {
			expect(convertWeight(2.5, 'kg', 'lb')).toBeCloseTo(5.511556, 4);
		});
	});

	describe('convertVolume', () => {
		test('converts liters to milliliters', () => {
			expect(convertVolume(1, 'l', 'ml')).toBe(1000);
		});

		test('converts milliliters to liters', () => {
			expect(convertVolume(1000, 'ml', 'l')).toBe(1);
		});

		test('converts liters to gallons', () => {
			expect(convertVolume(3.78541, 'l', 'gal')).toBeCloseTo(1, 4);
		});

		test('converts gallons to liters', () => {
			expect(convertVolume(1, 'gal', 'l')).toBeCloseTo(3.78541, 4);
		});

		test('converts liters to fluid ounces', () => {
			expect(convertVolume(1, 'l', 'oz')).toBeCloseTo(33.814, 2);
		});

		test('handles case-insensitive units', () => {
			const result1 = convertVolume(1, 'L', 'ML');
			const result2 = convertVolume(1, 'l', 'ml');
			expect(result1).toBe(result2);
		});

		test('throws error for invalid volume unit', () => {
			expect(() => convertVolume(1, 'invalid', 'l')).toThrow('Invalid volume unit');
		});

		test('throws error when converting between incompatible units', () => {
			expect(() => convertVolume(1, 'l', 'kg')).toThrow('Invalid volume unit');
		});

		test('handles zero values', () => {
			expect(convertVolume(0, 'l', 'ml')).toBe(0);
		});

		test('handles decimal values', () => {
			expect(convertVolume(2.5, 'l', 'ml')).toBe(2500);
		});
	});

	describe('isWeightUnit', () => {
		test('returns true for weight units', () => {
			expect(isWeightUnit('kg')).toBe(true);
			expect(isWeightUnit('lb')).toBe(true);
			expect(isWeightUnit('g')).toBe(true);
		});

		test('returns false for volume units', () => {
			expect(isWeightUnit('l')).toBe(false);
			expect(isWeightUnit('ml')).toBe(false);
			expect(isWeightUnit('oz')).toBe(false);
		});

		test('handles case-insensitive checks', () => {
			expect(isWeightUnit('KG')).toBe(true);
			expect(isWeightUnit('Lb')).toBe(true);
		});

		test('returns false for invalid units', () => {
			expect(isWeightUnit('invalid')).toBe(false);
		});
	});

	describe('isVolumeUnit', () => {
		test('returns true for volume units', () => {
			expect(isVolumeUnit('l')).toBe(true);
			expect(isVolumeUnit('ml')).toBe(true);
			expect(isVolumeUnit('gal')).toBe(true);
			expect(isVolumeUnit('oz')).toBe(true);
		});

		test('returns false for weight units', () => {
			expect(isVolumeUnit('kg')).toBe(false);
			expect(isVolumeUnit('lb')).toBe(false);
			expect(isVolumeUnit('g')).toBe(false);
		});

		test('handles case-insensitive checks', () => {
			expect(isVolumeUnit('L')).toBe(true);
			expect(isVolumeUnit('ML')).toBe(true);
		});

		test('returns false for invalid units', () => {
			expect(isVolumeUnit('invalid')).toBe(false);
		});
	});

	describe('convertPricePerUnit', () => {
		test('converts price for weight units (kg to lb)', () => {
			const pricePerKg = 28.95;
			const pricePerLb = convertPricePerUnit(pricePerKg, 'kg', 'lb');
			expect(pricePerLb).toBeCloseTo(pricePerKg * 0.45359237, 5);
		});

		test('converts price for weight units (lb to kg)', () => {
			const pricePerLb = 10;
			const pricePerKg = convertPricePerUnit(pricePerLb, 'lb', 'kg');
			expect(pricePerKg).toBeCloseTo(10 * 2.20462, 3);
		});

		test('converts price for volume units (l to oz)', () => {
			const pricePerL = 2.0;
			const pricePerOz = convertPricePerUnit(pricePerL, 'l', 'oz');
			expect(pricePerOz).toBeCloseTo(pricePerL * 0.0295735, 6);
		});

		test('round-trip conversion for weight units', () => {
			const pricePerKg = 28.95;
			const pricePerLb = convertPricePerUnit(pricePerKg, 'kg', 'lb');
			const roundTripPrice = convertPricePerUnit(pricePerLb, 'lb', 'kg');
			expect(roundTripPrice).toBeCloseTo(pricePerKg, 2);
		});

		test('round-trip conversion for volume units', () => {
			const pricePerL = 2.0;
			const pricePerOz = convertPricePerUnit(pricePerL, 'l', 'oz');
			const roundTripPrice = convertPricePerUnit(pricePerOz, 'oz', 'l');
			expect(roundTripPrice).toBeCloseTo(pricePerL, 2);
		});

		test('throws error when converting between incompatible unit types', () => {
			expect(() => convertPricePerUnit(10, 'kg', 'l')).toThrow('Cannot convert between incompatible units');
		});

		test('returns same price when from and to units are the same', () => {
			expect(convertPricePerUnit(10, 'kg', 'kg')).toBe(10);
		});

		test('handles zero prices', () => {
			expect(convertPricePerUnit(0, 'kg', 'lb')).toBe(0);
		});

		test('handles decimal prices', () => {
			expect(convertPricePerUnit(12.99, 'kg', 'lb')).toBeCloseTo(5.895, 2);
		});
	});

	describe('formatUnit', () => {
		test('formats weight units correctly', () => {
			expect(formatUnit('kg')).toBe('KG');
			expect(formatUnit('lb')).toBe('LB');
			expect(formatUnit('g')).toBe('G');
		});

		test('formats volume units correctly', () => {
			expect(formatUnit('l')).toBe('L');
			expect(formatUnit('ml')).toBe('ML');
			expect(formatUnit('gal')).toBe('GAL');
		});

		test('formats fluid ounce as FL OZ', () => {
			expect(formatUnit('oz')).toBe('FL OZ');
		});

		test('handles case-insensitive unit input', () => {
			expect(formatUnit('KG')).toBe('KG');
			expect(formatUnit('Lb')).toBe('LB');
		});

		test('returns uppercase unknown units', () => {
			expect(formatUnit('unknown')).toBe('UNKNOWN');
		});
	});
});
