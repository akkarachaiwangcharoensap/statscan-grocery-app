import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

// mock the hook to return predictable data
vi.mock('../hooks', () => ({
	useGroceryData: () => ({
		data: {
			locations: [
				{ location: 'Canada', city: '', province: 'Canada' },
				{ location: 'Ontario', city: '', province: 'Ontario' }
			]
		},
		loading: false,
		error: null
	})
}));

import LocationSelector from './LocationSelector';

describe('LocationSelector', () => {
	test('renders button with abbreviation and opens dropdown', async () => {
		render(<LocationSelector />);
		const btn = screen.getByRole('button', { name: /CA/ });
		expect(btn).toBeInTheDocument();

		// open and check options
		btn.click();
		expect(await screen.findByText('Ontario')).toBeInTheDocument();

		// select Ontario and expect abbreviation change
		screen.getByText('Ontario').click();
		expect(await screen.findByText('ON')).toBeInTheDocument();
	});
});
