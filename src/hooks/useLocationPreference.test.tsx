import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, beforeEach } from 'vitest';
import { useLocationPreference } from './useLocationPreference';

function TestComp({ id }: { id: string }) {
	const { location, setLocation } = useLocationPreference();
	return (
		<div>
			<div data-testid={`loc-${id}`}>{location}</div>
			<button onClick={() => setLocation('Ontario')} data-testid={`btn-${id}`}>
				Set Ontario
			</button>
		</div>
	);
}

describe('useLocationPreference', () => {
	beforeEach(() => {
		localStorage.clear();
	});

	test('syncs location between components', () => {
		render(
			<div>
				<TestComp id="a" />
				<TestComp id="b" />
			</div>
		);

		const a = screen.getByTestId('loc-a');
		const b = screen.getByTestId('loc-b');
		expect(a.textContent).toBe('Canada');
		expect(b.textContent).toBe('Canada');

		fireEvent.click(screen.getByTestId('btn-a'));

		// both should update in the same window via custom event
		expect(a.textContent).toBe('Ontario');
		expect(b.textContent).toBe('Ontario');
	});
});
