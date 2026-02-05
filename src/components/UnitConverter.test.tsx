import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UnitConverter from './UnitConverter';

describe('UnitConverter Component', () => {
	const defaultProps = {
		baseUnit: 'kg',
		basePrice: 10,
		onUnitChange: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('renders unit converter heading', () => {
		render(<UnitConverter {...defaultProps} />);
		expect(screen.getByText('Convert Unit')).toBeInTheDocument();
	});

	test('displays base unit as selected option', () => {
		render(<UnitConverter {...defaultProps} />);
		const kgRadio = screen.getByRole('radio', { name: /KG/i });
		expect(kgRadio).toBeChecked();
	});

	test('displays available units for weight conversion', () => {
		render(<UnitConverter {...defaultProps} />);
		expect(screen.getByRole('radio', { name: /KG/i })).toBeInTheDocument();
		expect(screen.getByRole('radio', { name: /LB/i })).toBeInTheDocument();
	});

	test('calls onUnitChange when a new unit is selected', () => {
		const onUnitChange = jest.fn();
		const props = { ...defaultProps, onUnitChange };
		render(<UnitConverter {...props} />);

		const lbRadio = screen.getByRole('radio', { name: /LB/i });
		fireEvent.click(lbRadio);

		expect(onUnitChange).toHaveBeenCalledWith('lb', expect.any(Number));
	});

	test('does not render if unit type is not supported', () => {
		const props = { baseUnit: 'unsupported', basePrice: 10 } as any;
		render(<UnitConverter {...props} />);
		expect(screen.queryByText('Convert Unit')).not.toBeInTheDocument();
	});

	test('handles volume unit conversion', () => {
		const onUnitChange = jest.fn();
		const props = { baseUnit: 'l', basePrice: 5, onUnitChange };
		render(<UnitConverter {...props} />);

		const ozRadio = screen.getByRole('radio', { name: /OZ/i });
		fireEvent.click(ozRadio);

		expect(onUnitChange).toHaveBeenCalledWith('oz', expect.any(Number));
	});

	test('passes correct converted price to onUnitChange callback', () => {
		const onUnitChange = jest.fn();
		const props = { baseUnit: 'kg', basePrice: 1, onUnitChange };
		render(<UnitConverter {...props} />);

		const lbRadio = screen.getByRole('radio', { name: /LB/i });
		fireEvent.click(lbRadio);

		const callArgs = onUnitChange.mock.calls[0];
		expect(callArgs[0]).toBe('lb');
		expect(callArgs[1]).toBeCloseTo(0.45359237, 4);
	});
});
