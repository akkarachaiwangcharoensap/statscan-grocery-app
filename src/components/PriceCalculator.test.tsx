import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PriceCalculator from './PriceCalculator';
import { ComparisonResult } from '../types';

describe('PriceCalculator Component', () => {
	const defaultProps = {
		userPrice: '',
		unit: 'kg',
		currentPrice: 10,
		onUserPriceChange: jest.fn(),
		onCalculate: jest.fn(),
	};

	const createMockComparisonResult = (overrides?: Partial<ComparisonResult>): ComparisonResult => ({
		userPrice: 10,
		statsCanPrice: 10,
		difference: 0,
		percentageDifference: 0,
		isSaving: false,
		product: 'Test Product',
		location: 'Test Location',
		year: '2024',
		...overrides,
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders price input in default per-unit mode', () => {
		render(<PriceCalculator {...defaultProps} />);
		expect(screen.getByLabelText(/Price per KG/i)).toBeInTheDocument();
	});

	it('displays the calculate button', () => {
		render(<PriceCalculator {...defaultProps} />);
		const button = screen.getByRole('button', { name: /Enter a price/i });
		expect(button).toBeDisabled();
	});

	it('enables calculate button when price is entered', () => {
		const props = { ...defaultProps, userPrice: '12.99' };
		render(<PriceCalculator {...props} />);
		const button = screen.getByRole('button', { name: /Compare/i });
		expect(button).toBeEnabled();
	});

	it('disables calculate button when current price is null', () => {
		const props = { ...defaultProps, currentPrice: null, userPrice: '12.99' };
		render(<PriceCalculator {...props} />);
		const button = screen.getByRole('button', { name: /Enter a price/i });
		expect(button).toBeDisabled();
	});

	it('calls onCalculate when compare button is clicked', async () => {
		const onCalculate = jest.fn();
		const props = { ...defaultProps, userPrice: '12.99', onCalculate };
		render(<PriceCalculator {...props} />);

		const button = screen.getByRole('button', { name: /Compare/i });
		fireEvent.click(button);

		expect(onCalculate).toHaveBeenCalled();
	});

	it('calls onCalculate on Enter key in per-unit mode', () => {
		const onCalculate = jest.fn();
		const props = { ...defaultProps, userPrice: '12.99', onCalculate };
		render(<PriceCalculator {...props} />);

		const input = screen.getByDisplayValue('12.99');
		fireEvent.keyDown(input, { key: 'Enter' });

		expect(onCalculate).toHaveBeenCalled();
	});

	it('switches to price-volume mode when button is clicked', () => {
		render(<PriceCalculator {...defaultProps} />);

		const priceVolButton = screen.getByRole('button', { name: /Price \+ Volume/i });
		fireEvent.click(priceVolButton);

		expect(screen.getByLabelText(/Product Price/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Volume \/ Weight/i)).toBeInTheDocument();
	});

	it('calculates and shows price per unit in price-volume mode', async () => {
		const onUserPriceChange = jest.fn();
		const onCalculate = jest.fn();
		const props = { ...defaultProps, onUserPriceChange, onCalculate };
		render(<PriceCalculator {...props} />);

		const priceVolButton = screen.getByRole('button', { name: /Price \+ Volume/i });
		fireEvent.click(priceVolButton);

		const priceInput = screen.getByLabelText(/Product Price/i);
		const volumeInput = screen.getByLabelText(/Volume \/ Weight/i);

		fireEvent.change(priceInput, { target: { value: '10' } });
		fireEvent.change(volumeInput, { target: { value: '2' } });

		await waitFor(() => {
			expect(screen.getByText(/Calculated Price per KG/i)).toBeInTheDocument();
		});

		await waitFor(() => {
			expect(screen.getByText(/\$5\.00/)).toBeInTheDocument();
		});
	});

	it('calls onCalculate with computed price in price-volume mode when Compare is clicked', async () => {
		const onUserPriceChange = jest.fn();
		const onCalculate = jest.fn();
		const props = { ...defaultProps, onUserPriceChange, onCalculate };
		render(<PriceCalculator {...props} />);

		const priceVolButton = screen.getByRole('button', { name: /Price \+ Volume/i });
		fireEvent.click(priceVolButton);

		const priceInput = screen.getByLabelText(/Product Price/i);
		const volumeInput = screen.getByLabelText(/Volume \/ Weight/i);

		fireEvent.change(priceInput, { target: { value: '10' } });
		fireEvent.change(volumeInput, { target: { value: '2' } });

		const button = screen.getByRole('button', { name: /Compare/i });
		fireEvent.click(button);

		expect(onUserPriceChange).toHaveBeenCalledWith('5.00');
		expect(onCalculate).toHaveBeenCalledWith('5.00');
	});

	it('displays saving result when user price is lower', () => {
		const comparisonResult = createMockComparisonResult({
			userPrice: 5,
			statsCanPrice: 10,
			difference: -5,
			percentageDifference: -50,
			isSaving: true,
		});
		const props = { ...defaultProps, comparisonResult };
		render(<PriceCalculator {...props} />);

		expect(screen.getByText(/You're Saving/i)).toBeInTheDocument();
		expect(screen.getByText((content) => content.replace(/\s+/g, '').includes('-$5.00'))).toBeInTheDocument();
	});

	it('displays paying more result when user price is higher', () => {
		const comparisonResult = createMockComparisonResult({
			userPrice: 15,
			statsCanPrice: 10,
			difference: 5,
			percentageDifference: 50,
			isSaving: false,
		});
		const props = { ...defaultProps, comparisonResult };
		render(<PriceCalculator {...props} />);

		expect(screen.getByText(/You're Paying More/i)).toBeInTheDocument();
		expect(screen.getByText(/\+\$5\.00/)).toBeInTheDocument();
	});

	it('displays same price result when difference is minimal', () => {
		const comparisonResult = createMockComparisonResult({
			userPrice: 10.005,
			statsCanPrice: 10,
			difference: 0.005,
			percentageDifference: 0.05,
			isSaving: false,
		});
		const props = { ...defaultProps, comparisonResult };
		render(<PriceCalculator {...props} />);

		expect(screen.getByText(/You're paying the same average!/i)).toBeInTheDocument();
	});

	it('has status role on results banner for accessibility', () => {
		const comparisonResult = createMockComparisonResult({
			userPrice: 5,
			statsCanPrice: 10,
			difference: -5,
			percentageDifference: -50,
			isSaving: true,
		});
		const props = { ...defaultProps, comparisonResult };
		render(<PriceCalculator {...props} />);

		const statusElement = screen.getByRole('status');
		expect(statusElement).toBeInTheDocument();
		expect(statusElement).toHaveAttribute('aria-live', 'polite');
	});

	it('updates user price when onUserPriceChange is called', async () => {
		const onUserPriceChange = jest.fn();
		const props = { ...defaultProps, onUserPriceChange };
		const { rerender } = render(<PriceCalculator {...props} />);

		const input = screen.getByPlaceholderText('0.00');
		fireEvent.change(input, { target: { value: '15.50' } });

		expect(onUserPriceChange).toHaveBeenCalledWith('15.50');

		rerender(<PriceCalculator {...props} userPrice="15.50" />);
		expect(screen.getByDisplayValue('15.50')).toBeInTheDocument();
	});

	it('displays proper labels for unit', () => {
		const props = { ...defaultProps, unit: 'lb' };
		render(<PriceCalculator {...props} />);

		expect(screen.getByLabelText(/Price per LB/i)).toBeInTheDocument();
		expect(screen.getAllByText(/per lb/i).length).toBeGreaterThan(0);
	});

	it('shows percentage difference in result', () => {
		const comparisonResult = createMockComparisonResult({
			userPrice: 8,
			statsCanPrice: 10,
			difference: -2,
			percentageDifference: -20,
			isSaving: true,
		});
		const props = { ...defaultProps, comparisonResult };
		render(<PriceCalculator {...props} />);

		expect(screen.getByText((content) => content.replace(/\s+/g, '').includes('(20.0%)'))).toBeInTheDocument();
	});

	describe('Very Small Price Comparisons', () => {
		it('correctly identifies difference when user pays 0.00799 and statscan is 0.0054', () => {
			const comparisonResult = createMockComparisonResult({
				userPrice: 0.00799,
				statsCanPrice: 0.0054,
				difference: 0.00259,
				percentageDifference: 47.96,
				isSaving: false,
			});
			const props = { ...defaultProps, comparisonResult };
			render(<PriceCalculator {...props} />);

			// Should show "You're Paying More" not "same price"
			expect(screen.getByText(/You're Paying More/i)).toBeInTheDocument();
			
			// Should display prices with appropriate decimal precision (4 decimals for <$0.01)
			expect(screen.getByText((content) => content.includes('$0.0080'))).toBeInTheDocument();
			expect(screen.getByText((content) => content.includes('$0.0054'))).toBeInTheDocument();
			
			// Should show percentage difference (formatted with space and 1 decimal place)
			expect(screen.getByText((content) => content.includes('48.0'))).toBeInTheDocument();
		});

		it('correctly identifies difference when user pays 0.0054 and statscan is 0.00799', () => {
			const comparisonResult = createMockComparisonResult({
				userPrice: 0.0054,
				statsCanPrice: 0.00799,
				difference: -0.00259,
				percentageDifference: -32.42,
				isSaving: true,
			});
			const props = { ...defaultProps, comparisonResult };
			render(<PriceCalculator {...props} />);

			// Should show "You're Saving" not "same price"
			expect(screen.getByText(/You're Saving/i)).toBeInTheDocument();
			
			// Should display prices with appropriate decimal precision
			expect(screen.getByText((content) => content.includes('$0.0054'))).toBeInTheDocument();
			expect(screen.getByText((content) => content.includes('$0.0080'))).toBeInTheDocument();
		});

		it('shows same price when prices are truly equal within relative tolerance', () => {
			const comparisonResult = createMockComparisonResult({
				userPrice: 0.00799,
				statsCanPrice: 0.00799,
				difference: 0,
				percentageDifference: 0,
				isSaving: false,
			});
			const props = { ...defaultProps, comparisonResult };
			render(<PriceCalculator {...props} />);

			// Should show "same average"
			expect(screen.getByText(/You're paying the same average/i)).toBeInTheDocument();
			
			// Should display same price with appropriate precision (uses bullet separator)
			expect(screen.getByText((content) => content.includes('Your price: $0.0080 • StatsCan: $0.0080'))).toBeInTheDocument();
		});

		it('displays prices below $0.01 with 4 decimal places', () => {
			const comparisonResult = createMockComparisonResult({
				userPrice: 0.00125,
				statsCanPrice: 0.00987,
				difference: -0.00862,
				percentageDifference: -87.33,
				isSaving: true,
			});
			const props = { ...defaultProps, comparisonResult };
			render(<PriceCalculator {...props} />);

			// Prices should show 4 decimal places
			expect(screen.getByText((content) => content.includes('$0.0013'))).toBeInTheDocument(); // 0.00125 rounds to 0.0013
			expect(screen.getByText((content) => content.includes('$0.0099'))).toBeInTheDocument(); // 0.00987 rounds to 0.0099
		});
	});
});
