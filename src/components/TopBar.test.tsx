import { render, screen } from '@testing-library/react';
import TopBar from './TopBar';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

vi.mock('./LocationSelector', () => ({
	default: () => <div data-testid="location-selector" />
}));

describe('TopBar', () => {
	test('renders brand and location selector', () => {
		render(
			<MemoryRouter>
				<TopBar />
			</MemoryRouter>
		);
		expect(screen.getByText(/Canadian Grocery/)).toBeInTheDocument();
		expect(screen.getByTestId('location-selector')).toBeInTheDocument();
	});
});
