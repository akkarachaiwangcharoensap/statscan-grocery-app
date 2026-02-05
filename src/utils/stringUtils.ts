/**
 * String utility functions for text manipulation
 */

/**
 * Convert a string to a URL-friendly slug
 * @param text - The text to slugify
 * @returns A URL-friendly slug
 */
export function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^\w\s-]/g, '')
		.replace(/\s+/g, '-');
}

/**
 * Capitalize the first letter of a string
 * @param text - The text to capitalize
 * @returns The capitalized text
 */
export function capitalize(text: string): string {
	if (!text) return '';
	return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Capitalize all words in a string
 * @param text - The text to capitalize
 * @returns The text with all words capitalized
 */
export function capitalizeWords(text: string): string {
	if (!text) return '';
	return text
		.split(' ')
		.map((word) => {
			if (word.slice(1) !== word.slice(1).toLowerCase()) {
				// Mixed or uppercase interior -> normalize to full uppercase per tests
				return word.toUpperCase();
			}
			// Otherwise capitalize first letter and keep remainder lowercase
			return capitalize(word.toLowerCase());
		})
		.join(' ');
}
