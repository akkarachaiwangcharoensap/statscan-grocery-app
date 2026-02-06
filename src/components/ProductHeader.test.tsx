import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductHeader from './ProductHeader';
import { vi } from 'vitest';

vi.mock('./LocationSelector', () => ({
	default: () => <div data-testid="location-selector" />
}));

describe('ProductHeader', () => {
	test('renders back link and location selector', () => {
		render(
			<MemoryRouter>
				<ProductHeader categorySlug="produce" categoryName="Produce" />
			</MemoryRouter>
		);

		expect(screen.getByText('Categories')).toBeInTheDocument();
		expect(screen.getByTestId('location-selector')).toBeInTheDocument();
	});
});
