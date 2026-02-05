import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductSearch from './ProductSearch';
import { Product } from '../types';

describe('ProductSearch Component', () => {
	const mockProducts: Product[] = [
		{ product_name: 'Milk 2%', product_category: 'Dairy', product_unit: 'l' },
		{ product_name: 'Whole Wheat Bread', product_category: 'Bakery', product_unit: 'unit' },
		{ product_name: 'Chicken Breast', product_category: 'Meat', product_unit: 'kg' },
		{ product_name: 'Fresh Milk', product_category: 'Dairy', product_unit: 'l' },
		{ product_name: 'Cheddar Cheese', product_category: 'Dairy', product_unit: 'kg' },
	];

	it('renders search input', () => {
		render(<ProductSearch products={mockProducts} />);
		const searchInput = screen.getByRole('searchbox');
		expect(searchInput).toBeInTheDocument();
		expect(searchInput).toHaveAttribute('placeholder', 'Search products (e.g. milk, chicken, bread)');
	});

	it('displays search results when typing', async () => {
		render(<ProductSearch products={mockProducts} />);
		const searchInput = screen.getByPlaceholderText(/Search products/i);

		fireEvent.change(searchInput, { target: { value: 'milk' } });

		await waitFor(() => {
			const options = screen.getAllByRole('option');
			expect(options.length).toBeGreaterThan(0);
			expect(options.some((opt) => opt.textContent?.includes('Milk 2%'))).toBe(true);
			expect(options.some((opt) => opt.textContent?.includes('Fresh Milk'))).toBe(true);
		}, { timeout: 1000 });
	});

	it('filters products based on search query', async () => {
		render(<ProductSearch products={mockProducts} />);
		const searchInput = screen.getByPlaceholderText(/Search products/i);

		fireEvent.change(searchInput, { target: { value: 'chicken' } });

		await waitFor(() => {
			const options = screen.getAllByRole('option');
			expect(options.length).toBeGreaterThan(0);
			expect(options[0]).toHaveTextContent(/Chicken Breast/i);
		}, { timeout: 1000 });
	});

	it('shows "No products found" when search yields no results', async () => {
		render(<ProductSearch products={mockProducts} />);
		const searchInput = screen.getByPlaceholderText(/Search products/i);

		fireEvent.change(searchInput, { target: { value: 'xyz123nonexistent' } });

		await waitFor(() => {
			expect(screen.getByText('No products found')).toBeInTheDocument();
		}, { timeout: 1000 });
	});

	it('clears search when clear button is clicked', async () => {
		render(<ProductSearch products={mockProducts} />);
		const searchInput = screen.getByPlaceholderText(/Search products/i) as HTMLInputElement;

		fireEvent.change(searchInput, { target: { value: 'milk' } });

		await waitFor(() => {
			expect(searchInput.value).toBe('milk');
			expect(screen.getByLabelText('Clear search')).toBeInTheDocument();
		}, { timeout: 1000 });

		const clearButton = screen.getByLabelText('Clear search');
		fireEvent.click(clearButton);

		expect(searchInput.value).toBe('');
	});

	it('handles keyboard navigation with arrow keys', async () => {
		render(<ProductSearch products={mockProducts} />);
		const searchInput = screen.getByPlaceholderText(/Search products/i);

		fireEvent.change(searchInput, { target: { value: 'milk' } });

		await waitFor(() => {
			expect(screen.getAllByRole('option').length).toBeGreaterThan(0);
		}, { timeout: 1000 });

		fireEvent.keyDown(searchInput, { key: 'ArrowDown' });

		await waitFor(() => {
			const firstOption = screen.getAllByRole('option')[0];
			expect(firstOption).toHaveAttribute('aria-selected', 'true');
		});
	});

	it('closes dropdown when Escape key is pressed', async () => {
		render(<ProductSearch products={mockProducts} />);
		const searchInput = screen.getByPlaceholderText(/Search products/i);

		fireEvent.change(searchInput, { target: { value: 'milk' } });

		await waitFor(() => {
			expect(screen.getAllByRole('option').length).toBeGreaterThan(0);
		}, { timeout: 1000 });

		fireEvent.keyDown(searchInput, { key: 'Escape' });

		await waitFor(() => {
			expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
		});
	});

	it('applies focus styles when input is focused', () => {
		render(<ProductSearch products={mockProducts} />);
		const searchInput = screen.getByRole('searchbox');

		expect(searchInput).toHaveClass('border-transparent');

		fireEvent.focus(searchInput);
		expect(searchInput).toHaveClass('border-emerald-500');
	});

	it('has proper ARIA attributes', () => {
		render(<ProductSearch products={mockProducts} />);
		const searchInput = screen.getByRole('searchbox');

		expect(searchInput).toHaveAttribute('aria-autocomplete', 'list');
		expect(searchInput).toHaveAttribute('aria-haspopup', 'listbox');
		expect(searchInput).toHaveAttribute('aria-controls', 'product-search-list');
	});

	it('limits search results to 8 items', async () => {
		const manyProducts: Product[] = Array.from({ length: 20 }, (_, i) => ({
			product_name: `Product ${i}`,
			product_category: 'Test',
			product_unit: 'kg',
		}));

		render(<ProductSearch products={manyProducts} />);
		const searchInput = screen.getByPlaceholderText(/Search products/i);

		fireEvent.change(searchInput, { target: { value: 'product' } });

		await waitFor(() => {
			const options = screen.getAllByRole('option');
			expect(options.length).toBeLessThanOrEqual(8);
		}, { timeout: 1000 });
	});

	it('handles empty product list', () => {
		render(<ProductSearch products={[]} />);
		const searchInput = screen.getByRole('searchbox');
		expect(searchInput).toBeInTheDocument();
	});

	it('handles undefined products prop with default empty array', () => {
		render(<ProductSearch />);
		const searchInput = screen.getByRole('searchbox');
		expect(searchInput).toBeInTheDocument();
	});
});
