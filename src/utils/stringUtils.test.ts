import { slugify, capitalize, capitalizeWords } from './stringUtils';

describe('stringUtils', () => {
	describe('slugify', () => {
		test('converts text to lowercase slug', () => {
			expect(slugify('Hello World')).toBe('hello-world');
		});

		test('replaces spaces with hyphens', () => {
			expect(slugify('the quick brown fox')).toBe('the-quick-brown-fox');
		});

		test('removes special characters', () => {
			expect(slugify('hello@world!')).toBe('helloworld');
		});

		test('removes punctuation', () => {
			expect(slugify('hello, world!')).toBe('hello-world');
		});

		test('handles multiple spaces', () => {
			expect(slugify('hello    world')).toBe('hello-world');
		});

		test('preserves existing hyphens', () => {
			expect(slugify('hello-world')).toBe('hello-world');
		});

		test('handles empty string', () => {
			expect(slugify('')).toBe('');
		});

		test('handles strings with numbers', () => {
			expect(slugify('Product 123')).toBe('product-123');
		});

		test('handles strings with parentheses', () => {
			expect(slugify('Product (Fresh)')).toBe('product-fresh');
		});

		test('handles strings with slashes', () => {
			expect(slugify('Product/Type')).toBe('producttype');
		});
	});

	describe('capitalize', () => {
		test('capitalizes first letter', () => {
			expect(capitalize('hello')).toBe('Hello');
		});

		test('does not change already capitalized word', () => {
			expect(capitalize('Hello')).toBe('Hello');
		});

		test('handles single character', () => {
			expect(capitalize('a')).toBe('A');
		});

		test('handles empty string', () => {
			expect(capitalize('')).toBe('');
		});

		test('only capitalizes first letter', () => {
			expect(capitalize('hELLO')).toBe('HELLO');
		});

		test('handles strings with leading spaces', () => {
			expect(capitalize('  hello')).toBe('  hello');
		});
	});

	describe('capitalizeWords', () => {
		test('capitalizes all words', () => {
			expect(capitalizeWords('hello world')).toBe('Hello World');
		});

		test('handles single word', () => {
			expect(capitalizeWords('hello')).toBe('Hello');
		});

		test('handles empty string', () => {
			expect(capitalizeWords('')).toBe('');
		});

		test('handles multiple spaces between words', () => {
			expect(capitalizeWords('hello  world')).toBe('Hello  World');
		});

		test('handles already capitalized words', () => {
			expect(capitalizeWords('Hello World')).toBe('Hello World');
		});

		test('capitalizes all words regardless of case', () => {
			expect(capitalizeWords('hELLO wORLD')).toBe('HELLO WORLD');
		});

		test('handles mixed case input', () => {
			expect(capitalizeWords('tHe QuICk BrOwN fOx')).toBe('THE QUICK BROWN FOX');
		});
	});
});
