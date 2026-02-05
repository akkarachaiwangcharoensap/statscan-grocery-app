import React, { useState, useCallback, useEffect, useRef } from 'react';
import { isWeightUnit, isVolumeUnit, convertPricePerUnit, formatUnit } from '../utils';

export interface UnitConverterProps {
	baseUnit: string;
	basePrice: number;
	onUnitChange?: (unit: string, convertedPrice: number) => void;
}

/**
 * Unit conversion type that maps base units to possible conversions
 */
type UnitConversions = Record<string, string[]>;

/**
 * Weight unit conversions — restrict to sensible pairs: kg <-> lb
 */
const WEIGHT_CONVERSIONS: UnitConversions = {
	kg: ['lb'],
	lb: ['kg'],
	// keep g as a minor weight unit mapping to kg/lb if needed
	g: ['kg', 'lb'],
};

/**
 * Volume unit conversions — include fluid ounce (oz) as a volume unit
 * and allow liters <-> oz conversions only
 */
const VOLUME_CONVERSIONS: UnitConversions = {
	l: ['oz'],
	oz: ['l'],
	ml: ['l'],
};

/**
 * UnitConverter component allows users to convert prices between different units
 * @param props - Component props
 * @returns The unit converter component
 */
export default function UnitConverter({
	baseUnit,
	basePrice,
	onUnitChange,
}: UnitConverterProps): React.JSX.Element {
	const [selectedUnit, setSelectedUnit] = useState<string>(baseUnit);
	const didMountRef = useRef(false);

	useEffect(() => {
		// Keep internal selected unit in sync if parent changes the base unit
		setSelectedUnit(baseUnit);
	}, [baseUnit]);

	// Notify parent when base price or base unit changes (but skip the initial mount)
	const prevBaseRef = useRef({ basePrice, baseUnit });
	useEffect(() => {
		if (!didMountRef.current) {
			didMountRef.current = true;
			prevBaseRef.current = { basePrice, baseUnit };
			return;
		}

		// Only react to actual changes in basePrice/baseUnit to avoid duplicate notifications
		if (prevBaseRef.current.basePrice === basePrice && prevBaseRef.current.baseUnit === baseUnit) {
			return;
		}

		prevBaseRef.current = { basePrice, baseUnit };

		if (!onUnitChange) return;

		try {
			const converted = selectedUnit !== baseUnit
				? convertPricePerUnit(basePrice, baseUnit, selectedUnit)
				: basePrice;
			onUnitChange(selectedUnit, converted);
		} catch (error) {
			console.error('Unit conversion error on base change:', error);
		}
	}, [basePrice, baseUnit, onUnitChange, selectedUnit]);

	/**
	 * Determine available unit conversions based on base unit type
	 */
	const getAvailableUnits = useCallback((): string[] => {
		const normalizedBase = baseUnit.toLowerCase();

		if (isWeightUnit(normalizedBase)) {
			return [baseUnit, ...(WEIGHT_CONVERSIONS[normalizedBase] || [])];
		}

		if (isVolumeUnit(normalizedBase)) {
			return [baseUnit, ...(VOLUME_CONVERSIONS[normalizedBase] || [])];
		}

		return [baseUnit];
	}, [baseUnit]);

	/**
	 * Handle unit selection change
	 */
	const handleUnitChange = useCallback(
		(newUnit: string) => {
			setSelectedUnit(newUnit);

			if (newUnit !== baseUnit) {
				try {
					const convertedPrice = convertPricePerUnit(basePrice, baseUnit, newUnit);
					onUnitChange?.(newUnit, convertedPrice);
				} catch (error) {
					console.error('Unit conversion error:', error);
				}
			} else {
				onUnitChange?.(baseUnit, basePrice);
			}
		},
		[baseUnit, basePrice, onUnitChange]
	);

	const availableUnits = getAvailableUnits();
	const isWeightBased = isWeightUnit(baseUnit.toLowerCase());
	const isVolumeBased = isVolumeUnit(baseUnit.toLowerCase());

	// Don't render if unit type is not supported
	if (!isWeightBased && !isVolumeBased) {
		return <></>;
	}

	const convertedPrice =
		selectedUnit !== baseUnit
			? convertPricePerUnit(basePrice, baseUnit, selectedUnit)
			: basePrice;

	return (
		<div className="bg-white/60 backdrop-blur-sm border border-white/80 rounded-2xl p-5 sm:p-6 mb-6">
			<h3 className="text-lg sm:text-xl font-light text-slate-900 mb-3 sm:mb-4">Convert Unit</h3>

			<div className="space-y-3 sm:space-y-4">
				{/* Unit selector (radio buttons for better UX and accessibility) */}
				<div>
					<p className="block text-sm sm:text-base font-light text-slate-700 mb-2">Select Unit</p>
					<div role="radiogroup" aria-label="Unit selector" className="flex gap-2 flex-wrap">
						{availableUnits.map((unit) => {
							const id = `unit-${unit}`;
							const checked = selectedUnit === unit;
							return (
								<label
									key={unit}
									htmlFor={id}
									className={`inline-flex items-center px-4 sm:px-3 py-3 sm:py-2 border rounded-lg hover:cursor-pointer transition-colors min-h-[44px] touch-manipulation ${checked ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white/60 text-slate-900 border-white/80 hover:bg-white/80'}`}>
									<input
										id={id}
										name="unit"
										type="radio"
										value={unit}
										checked={checked}
										onChange={() => handleUnitChange(unit)}
										className="sr-only"
									/>
									<span className="text-sm sm:text-sm font-light">{formatUnit(unit)}</span>
								</label>
							);
						})}
					</div>
				</div>

				{/* Price conversion display */}
				{selectedUnit !== baseUnit && (
					<div className="p-4 sm:p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
						<div className="space-y-2">
							<div className="flex justify-between items-baseline gap-2">
								<span className="text-xs sm:text-sm text-slate-600 font-light">Base ({formatUnit(baseUnit)}):</span>
								<span className="text-sm sm:text-base text-slate-900 font-light">${basePrice.toFixed(2)}</span>
							</div>
							<div className="flex justify-between items-baseline gap-2 border-t border-blue-200 pt-2">
								<span className="text-xs sm:text-sm text-slate-600 font-light">Converted ({formatUnit(selectedUnit)}):</span>
								<span className="text-base sm:text-lg text-emerald-600 font-semibold">${convertedPrice.toFixed(2)}</span>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
