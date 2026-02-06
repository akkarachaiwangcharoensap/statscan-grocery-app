import React from 'react';
import { ComparisonResult } from '../types';
import { formatPrice } from '../utils';

interface PriceCalculatorProps {
    userPrice: string;
    unit: string;
    currentPrice: number | null;
    onUserPriceChange: (price: string) => void;
    // onCalculate now accepts an optional user price string to avoid async state races
    onCalculate: (price?: string) => void;
    comparisonResult?: ComparisonResult | null;
}

type InputMode = 'per-unit' | 'price-volume';

/**
 * PriceCalculator component for price input and comparison.
 * Apple-inspired flat design with Font Awesome icons
 * Always shows the input field and displays comparison results as a centered banner.
 * Supports two modes: price per unit or price + volume entry.
 */
export default function PriceCalculator({
    userPrice,
    unit,
    currentPrice,
    onUserPriceChange,
    onCalculate,
    comparisonResult = null,
}: PriceCalculatorProps): React.JSX.Element {
    const [inputMode, setInputMode] = React.useState<InputMode>('per-unit');
    const [productPrice, setProductPrice] = React.useState<string>('');
    const [productVolume, setProductVolume] = React.useState<string>('');

    const canCalculate = inputMode === 'per-unit' 
        ? Boolean(userPrice) && currentPrice !== null
        : Boolean(productPrice) && Boolean(productVolume) && currentPrice !== null;
    
    // Use relative tolerance: prices are the same if difference is less than 1% of the base price
    // Use a very small minimum tolerance to avoid treating small but meaningful differences as equal
    const tolerance = comparisonResult ? Math.max(1e-6, comparisonResult.statsCanPrice * 0.01) : 1e-6;
    const isSame = comparisonResult ? Math.abs(comparisonResult.difference) < tolerance : false;

    // Calculate price per unit when in price-volume mode
    const handlePriceVolumeCalculate = () => {
        if (productPrice && productVolume) {
            const pricePerUnit = parseFloat(productPrice) / parseFloat(productVolume);
            // Keep up to 3 significant figures for consistency
            const priceStr = Number(pricePerUnit).toPrecision(3);
            // Update parent's user price and pass the computed value directly to onCalculate
            onUserPriceChange(priceStr);
            onCalculate(priceStr);
        }
    };

    const handleCalculateClick = () => {
        if (inputMode === 'price-volume') {
            handlePriceVolumeCalculate();
        } else {
            onCalculate();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && canCalculate) {
            handleCalculateClick();
        }
    };

    return (
        <div className="bg-slate-50 rounded-3xl p-4 sm:p-8">
            {/* Results Banner - Same Price */}
            {comparisonResult && isSame && (
                <div
                    role="status"
                    aria-live="polite"
                    className="mb-6 p-6 rounded-2xl text-center bg-slate-100 border-2 border-slate-300"
                >
                    <div className="mb-2">
                        <i className="fas fa-equals text-2xl sm:text-3xl text-slate-600" aria-hidden="true"></i>
                    </div>
                    <p className="text-lg sm:text-xl font-semibold text-slate-900">You're paying the same average!</p>
                    <p className="text-sm text-slate-600 mt-2">
                        Your price: ${formatPrice(comparisonResult.userPrice)} • StatsCan: ${formatPrice(comparisonResult.statsCanPrice, { official: true })}
                    </p>
                </div>
            )}

            {/* Results Banner - Saving or Paying More */}
            {comparisonResult && !isSame && (
                <div
                    role="status"
                    aria-live="polite"
                    className={`mb-6 p-6 rounded-2xl text-center border-2 ${comparisonResult.isSaving
                            ? 'bg-emerald-50 border-emerald-300'
                            : 'bg-red-50 border-red-300'
                        }`}
                >
                    <div className="mb-2">
                        <i className={`fas ${comparisonResult.isSaving ? 'fa-arrow-down' : 'fa-arrow-up'} text-2xl sm:text-3xl ${comparisonResult.isSaving ? 'text-emerald-600' : 'text-red-600'
                            }`} aria-hidden="true"></i>
                    </div>
                    <p className={`text-lg sm:text-xl font-semibold ${comparisonResult.isSaving ? 'text-emerald-900' : 'text-red-900'
                        }`}>
                        {comparisonResult.isSaving ? "You're Saving" : "You're Paying More"}
                    </p>
                    <div className="flex items-baseline justify-center gap-2 mt-2">
                        <span className={`text-2xl sm:text-3xl font-bold ${comparisonResult.isSaving ? 'text-emerald-700' : 'text-red-700'
                            }`}>
                            {comparisonResult.isSaving ? '-' : '+'}${formatPrice(Math.abs(comparisonResult.difference))}
                        </span>
                        <span className={`text-base sm:text-lg font-medium ${comparisonResult.isSaving ? 'text-emerald-600' : 'text-red-600'
                            }`}>
                            ({Math.abs(comparisonResult.percentageDifference).toFixed(1)}%)
                        </span>
                    </div>
                    <p className="text-sm text-slate-600 mt-3">
                        Your price: ${formatPrice(comparisonResult.userPrice)} vs StatsCan: ${formatPrice(comparisonResult.statsCanPrice, { official: true })}
                    </p>
                </div>
            )}

            {/* Mode Toggle */}
            <div className="mb-6">
                <div className="inline-flex rounded-xl bg-slate-200 p-1 w-full">
                    <button
                        onClick={() => setInputMode('per-unit')}
                        className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all hover:cursor-pointer ${
                            inputMode === 'per-unit'
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        <i className="fas fa-dollar-sign mr-2" aria-hidden="true"></i>
                        Price per {unit.toUpperCase()}
                    </button>
                    <button
                        onClick={() => setInputMode('price-volume')}
                        className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all hover:cursor-pointer ${
                            inputMode === 'price-volume'
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        <i className="fas fa-calculator mr-2" aria-hidden="true"></i>
                        Price + Volume
                    </button>
                </div>
            </div>

            {/* Price Per Unit Input Mode */}
            {inputMode === 'per-unit' && (
                <div className="mb-4">
                    <label htmlFor="price-input" className="block text-sm font-semibold text-slate-700 mb-2">
                        <i className="fas fa-dollar-sign mr-1" aria-hidden="true"></i>
                        Price per {unit.toUpperCase()}
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium text-base">
                            $
                        </span>
                        <input
                            id="price-input"
                            type="number"
                            inputMode="decimal"
                            step="0.01"
                            min="0"
                            value={userPrice}
                            onChange={(e) => onUserPriceChange(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="0.00"
                            aria-describedby="price-unit-desc"
                            className="w-full h-14 pl-8 pr-16 text-lg font-medium border-2 border-slate-300 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold text-sm uppercase pointer-events-none">
                            per {unit}
                        </span>
                    </div>
                    <p id="price-unit-desc" className="sr-only">per {unit.toUpperCase()}</p>
                </div>
            )}

            {/* Price + Volume Input Mode */}
            {inputMode === 'price-volume' && (
                <div className="space-y-4 mb-4">
                    {/* Product Price */}
                    <div>
                        <label htmlFor="product-price-input" className="block text-sm font-semibold text-slate-700 mb-2">
                            <i className="fas fa-tag mr-1" aria-hidden="true"></i>
                            Product Price
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium text-base">
                                $
                            </span>
                            <input
                                id="product-price-input"
                                type="number"
                                inputMode="decimal"
                                step="0.01"
                                min="0"
                                value={productPrice}
                                onChange={(e) => setProductPrice(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="0.00"
                                className="w-full h-14 pl-8 pr-4 text-lg font-medium border-2 border-slate-300 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Product Volume */}
                    <div>
                        <label htmlFor="product-volume-input" className="block text-sm font-semibold text-slate-700 mb-2">
                            <i className="fas fa-weight mr-1" aria-hidden="true"></i>
                            Volume / Weight
                        </label>
                        <div className="relative">
                            <input
                                id="product-volume-input"
                                type="number"
                                inputMode="decimal"
                                step="0.01"
                                min="0"
                                value={productVolume}
                                onChange={(e) => setProductVolume(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="0.00"
                                className="w-full h-14 pl-4 pr-16 text-lg font-medium border-2 border-slate-300 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold text-sm uppercase pointer-events-none">
                                {unit}
                            </span>
                        </div>
                    </div>

                    {/* Calculated Preview */}
                    {productPrice && productVolume && parseFloat(productVolume) > 0 && (() => {
                        const computed = parseFloat(productPrice) / parseFloat(productVolume);
                        const preview = Number(computed).toPrecision(3);
                        return (
                            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4">
                                <p className="text-xs font-semibold text-emerald-700 mb-1">
                                    <i className="fas fa-calculator mr-1" aria-hidden="true"></i>
                                    Calculated Price per {unit.toUpperCase()}
                                </p>
                                <p className="text-xl sm:text-2xl font-bold text-emerald-900">
                                    ${preview}
                                    <span className="text-xs sm:text-sm font-medium text-emerald-600 ml-2">per {unit}</span>
                                </p>
                            </div>
                        );
                    })()}
                </div>
            )}

            {/* Compare Button */}
            <button
                onClick={handleCalculateClick}
                disabled={!canCalculate}
                className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 hover:cursor-pointer active:bg-emerald-700 text-white font-semibold text-lg rounded-xl transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed disabled:text-slate-500 flex items-center justify-center gap-2"
            >
                {canCalculate ? (
                    <>
                        <i className="fas fa-calculator" aria-hidden="true"></i>
                        Compare
                    </>
                ) : (
                    inputMode === 'per-unit' ? 'Enter a price' : 'Enter price and volume'
                )}
            </button>
        </div>
    );
}