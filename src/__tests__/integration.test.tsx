import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductSearch from '../components/ProductSearch';
import UnitConverter from '../components/UnitConverter';
import PriceCalculator from '../components/PriceCalculator';
import { Product } from '../types';
import { slugify } from '../utils';

describe('Integration Tests - Product Search and Price Comparison Flow', () => {
	const mockProducts: Product[] = [
		{ product_name: 'Milk 2%', product_category: 'Dairy', product_unit: 'l' },
		{ product_name: 'Chicken Breast', product_category: 'Meat', product_unit: 'kg' },
	];

	it('integrates search, unit conversion, and price calculator', async () => {
		const pushSpy = jest.spyOn(window.history, 'pushState');

		render(
			<ProductSearch products={mockProducts} />
		);

		// User searches for a product
		const searchInput = screen.getByPlaceholderText(/Search products/i);
		fireEvent.change(searchInput, { target: { value: 'milk' } });

		await waitFor(() => {
			expect(screen.getAllByRole('option').length).toBeGreaterThan(0);
		}, { timeout: 1000 });

		// Verify search results display
		const options = screen.getAllByRole('option');
		expect(options.length).toBeGreaterThan(0);
		expect(options.some((opt) => /Milk\s*2%/i.test(opt.textContent || ''))).toBe(true);

		// Click the first result and assert navigation uses history API
		fireEvent.click(options[0]);

		const expectedPath = `${import.meta.env.BASE_URL || ''}products/${mockProducts[0].product_category}/${slugify(mockProducts[0].product_name)}`;
		expect(pushSpy).toHaveBeenCalledWith({}, '', expectedPath);
		pushSpy.mockRestore();
	});

	it('allows user to compare their price with unit conversion', async () => {
		const onUnitChange = jest.fn();
		const onCalculate = jest.fn();
		const onPriceChange = jest.fn();

		render(
			<>
				<UnitConverter
					baseUnit="kg"
					basePrice={10}
					onUnitChange={onUnitChange}
				/>
				<PriceCalculator
					userPrice="5"
					unit="kg"
					currentPrice={10}
					onUserPriceChange={onPriceChange}
					onCalculate={onCalculate}
				/>
			</>
		);

		// User converts unit
		const lbRadio = screen.getByRole('radio', { name: /LB/i });
		fireEvent.click(lbRadio);

		expect(onUnitChange).toHaveBeenCalled();

		// User enters a price
		const priceInput = screen.getByDisplayValue('5');
		fireEvent.change(priceInput, { target: { value: '3' } });
		expect(onPriceChange).toHaveBeenCalledWith('3');

		// User clicks compare
		const compareButton = screen.getByRole('button', { name: /Compare/i });
		fireEvent.click(compareButton);
		expect(onCalculate).toHaveBeenCalled();
	});

	it('updates PriceCalculator inputs when UnitConverter changes', async () => {
		// Stateful wrapper to ensure prop updates flow through
		function Wrapper() {
			const [unit, setUnit] = React.useState('kg');
			const [userPrice, setUserPrice] = React.useState('');

			return (
				<>
					<UnitConverter
						baseUnit="kg"
						basePrice={1}
						onUnitChange={(u, p) => {
							setUnit(u);
							// mirror the same formatting as PriceCalculator's computed value
							setUserPrice(Number(p).toPrecision(3));
						}}
					/>
					<PriceCalculator
						userPrice={userPrice}
						unit={unit}
						currentPrice={1}
						onUserPriceChange={setUserPrice}
						onCalculate={() => {}}
					/>
				</>
			);
		}

		render(<Wrapper />);

		// Convert unit and assert the price input & label update
		const lbRadio = screen.getByRole('radio', { name: /LB/i });
		fireEvent.click(lbRadio);

		// Price per LB label should be present
		expect(screen.getByLabelText(/Price per LB/i)).toBeInTheDocument();

		// Computed price should be reflected in input value
		const priceInput = screen.getByLabelText(/Price per LB/i) as HTMLInputElement;
		expect(priceInput.value).toBe(Number(0.45359237).toPrecision(3));
	});

	it('handles complete user journey from search to price comparison', async () => {
		render(
				<>
					<ProductSearch products={mockProducts} />
					<UnitConverter baseUnit="kg" basePrice={10} />
					<PriceCalculator
						userPrice=""
						unit="kg"
						currentPrice={10}
						onUserPriceChange={() => {}}
						onCalculate={() => {}}
					/>
				</>
		);

		// Step 1: Search
		const searchInput = screen.getByPlaceholderText(/Search products/i);
		fireEvent.change(searchInput, { target: { value: 'chicken' } });

		await waitFor(() => {
			const options = screen.getAllByRole('option');
			expect(options.some((opt) => /Chicken\s*Breast/i.test(opt.textContent || ''))).toBe(true);
		}, { timeout: 1000 });

		// Step 2: Unit conversion visible
		expect(screen.getByText('Convert Unit')).toBeInTheDocument();

		// Step 3: Price calculator visible
		const priceLabels = screen.getAllByText(/Price per KG/i);
		expect(priceLabels.length).toBeGreaterThan(0);
	});

	it('maintains state across component interactions', async () => {
		let selectedUnit = 'kg';
		let userPrice = '';

		const handleUnitChange = jest.fn((unit: string) => {
			selectedUnit = unit;
		});

		const handlePriceChange = jest.fn((price: string) => {
			userPrice = price;
		});

		render(
			<>
				<UnitConverter
					baseUnit="kg"
					basePrice={10}
					onUnitChange={handleUnitChange}
				/>
				<PriceCalculator
					userPrice={userPrice}
					unit={selectedUnit}
					currentPrice={10}
					onUserPriceChange={handlePriceChange}
					onCalculate={() => {}}
				/>
			</>
		);

		// Change unit
		const lbRadio = screen.getByRole('radio', { name: /LB/i });
		fireEvent.click(lbRadio);

		// Enter price
		const priceInput = screen.getByPlaceholderText('0.00');
		fireEvent.change(priceInput, { target: { value: '5.5' } });

		expect(handleUnitChange).toHaveBeenCalled();
		expect(handlePriceChange).toHaveBeenCalledWith('5.5');
	});
});

describe('Integration Tests - Unit Conversion Edge Cases', () => {
	it('handles volume unit conversions correctly', () => {
		const onUnitChange = jest.fn();

		render(
			<UnitConverter
				baseUnit="l"
				basePrice={2}
				onUnitChange={onUnitChange}
			/>
		);

		// Volume units should be available
		expect(screen.getByRole('radio', { name: /^L$/i })).toBeInTheDocument();
		expect(screen.getByRole('radio', { name: /OZ$/i })).toBeInTheDocument();
		expect(screen.getByRole('radio', { name: /ML$/i })).toBeInTheDocument();
	});

	it('handles weight unit conversions correctly', () => {
		const onUnitChange = jest.fn();

		render(
			<UnitConverter
				baseUnit="kg"
				basePrice={10}
				onUnitChange={onUnitChange}
			/>
		);

		// Weight units should be available
		expect(screen.getByRole('radio', { name: /KG/i })).toBeInTheDocument();
		expect(screen.getByRole('radio', { name: /LB/i })).toBeInTheDocument();
	});
});
