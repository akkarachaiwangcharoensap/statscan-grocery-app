/**
 * Unit conversion utilities for grocery price calculations
 * Handles conversion between different units of measurement
 */

export type MeasurementUnit = 'kg' | 'lb' | 'g' | 'oz' | 'l' | 'ml' | 'gal';

interface ConversionRate {
	[key: string]: number;
}

/**
 * Conversion rates to base units (kg for weight, L for volume)
 * Note: 'oz' in this project is treated as a fluid ounce (volume) and
 * therefore does not belong to the weight conversions. This avoids
 * ambiguous or nonsensical conversions like kg -> oz.
 */
const WEIGHT_CONVERSIONS: ConversionRate = {
	kg: 1,
	lb: 0.45359237, // kg per lb (more precise)
	g: 0.001,
	// intentionally omitting 'oz' (fluid/weight ambiguity)
};

const VOLUME_CONVERSIONS: ConversionRate = {
	l: 1,
	ml: 0.001,
	gal: 3.78541,
	// fluid ounce: 1 fl oz = 0.0295735 L
	oz: 0.0295735,
};

/**
 * Convert weight between different units
 * @param value - The value to convert
 * @param fromUnit - The source unit
 * @param toUnit - The target unit
 * @returns The converted value
 */
export function convertWeight(value: number, fromUnit: string, toUnit: string): number {
	const normalizedFrom = fromUnit.toLowerCase();
	const normalizedTo = toUnit.toLowerCase();

	if (!(normalizedFrom in WEIGHT_CONVERSIONS) || !(normalizedTo in WEIGHT_CONVERSIONS)) {
		throw new Error(`Invalid weight unit: ${fromUnit} or ${toUnit}`);
	}

	// Convert to base unit (kg) first, then to target unit
	const baseValue = value * WEIGHT_CONVERSIONS[normalizedFrom];
	return baseValue / WEIGHT_CONVERSIONS[normalizedTo];
}

/**
 * Convert volume between different units
 * @param value - The value to convert
 * @param fromUnit - The source unit
 * @param toUnit - The target unit
 * @returns The converted value
 */
export function convertVolume(value: number, fromUnit: string, toUnit: string): number {
	const normalizedFrom = fromUnit.toLowerCase();
	const normalizedTo = toUnit.toLowerCase();

	if (!(normalizedFrom in VOLUME_CONVERSIONS) || !(normalizedTo in VOLUME_CONVERSIONS)) {
		throw new Error(`Invalid volume unit: ${fromUnit} or ${toUnit}`);
	}

	// Convert to base unit (L) first, then to target unit
	const baseValue = value * VOLUME_CONVERSIONS[normalizedFrom];
	return baseValue / VOLUME_CONVERSIONS[normalizedTo];
}

/**
 * Determine if a unit is a weight unit
 * @param unit - The unit to check
 * @returns True if the unit is a weight unit
 */
export function isWeightUnit(unit: string): boolean {
	return unit.toLowerCase() in WEIGHT_CONVERSIONS;
}

/**
 * Determine if a unit is a volume unit
 * @param unit - The unit to check
 * @returns True if the unit is a volume unit
 */
export function isVolumeUnit(unit: string): boolean {
	return unit.toLowerCase() in VOLUME_CONVERSIONS;
}

/**
 * Convert price per unit to a different unit
 * @param price - The price per source unit
 * @param fromUnit - The source unit
 * @param toUnit - The target unit
 * @returns The price per target unit
 */
export function convertPricePerUnit(price: number, fromUnit: string, toUnit: string): number {
	const normalizedFrom = fromUnit.toLowerCase();
	const normalizedTo = toUnit.toLowerCase();

	if (isWeightUnit(normalizedFrom) && isWeightUnit(normalizedTo)) {
		// For price conversion we need the number of source-units in one target-unit.
		// Example: If price is $10 per kg and we want price per lb:
		// 1 lb = 0.45359237 kg, so price per lb = price_per_kg * 0.45359237
		const conversionFactor = convertWeight(1, normalizedTo, normalizedFrom);
		return price * conversionFactor;
	}

	if (isVolumeUnit(normalizedFrom) && isVolumeUnit(normalizedTo)) {
		// Same logic for volumes — how many source-units are in one target-unit
		const conversionFactor = convertVolume(1, normalizedTo, normalizedFrom);
		return price * conversionFactor;
	}

	throw new Error(`Cannot convert between incompatible units: ${fromUnit} and ${toUnit}`);
}

/**
 * Format a unit for display
 * @param unit - The unit to format
 * @returns The formatted unit string
 */
export function formatUnit(unit: string): string {
	const unitMap: Record<string, string> = {
		kg: 'KG',
		lb: 'LB',
		g: 'G',
		oz: 'FL OZ', // display as fluid ounce for clarity
		l: 'L',
		ml: 'ML',
		gal: 'GAL',
	};

	const normalized = unit.toLowerCase();
	return unitMap[normalized] || unit.toUpperCase();
}
