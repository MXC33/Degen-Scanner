// client/src/utilities/formatNumbers.ts

/**
 * Format a price based on its value:
 * - If price >= 1, show two decimals.
 * - If 1 > price >= 0.01, show two decimals.
 * - If 0.01 > price >= 0.001, show three decimals.
 * - If price < 0.001, show up to six decimals.
 * 
 * @param {number | null | undefined} number - The number to format.
 * @returns {string} - Formatted number string with correct decimals.
 */
export function formatSmallNumber(number: number | null | undefined): string {
  if (number === null || number === undefined) return "N/A";
  if (number >= 1) {
    return number.toFixed(2); // Show 2 decimals
  } else if (number >= 0.01) {
    return number.toFixed(2); // Show 2 decimals
  } else if (number >= 0.001) {
    return number.toFixed(3); // Show 3 decimals
  } else {
    return number.toFixed(6); // Show 6 decimals for very small numbers
  }
}

/**
 * Format large numbers with abbreviations:
 * - If number >= 1 trillion, format with 'T'.
 * - If number >= 1 billion, format with 'B'.
 * - If number >= 1 million, format with 'M'.
 * - If number >= 1 thousand, format with 'K'.
 * 
 * @param {number | null | undefined} number - The large number to format.
 * @returns {string} - Abbreviated number string with correct suffix.
 */
export function formatLargeNumber(number: number | null | undefined): string {
  if (number === null || number === undefined) return "N/A";
  
  if (number >= 1e12) {
    return (number / 1e12).toFixed(2) + 'T'; // Trillions
  } else if (number >= 1e9) {
    return (number / 1e9).toFixed(2) + 'B'; // Billions
  } else if (number >= 1e6) {
    return (number / 1e6).toFixed(2) + 'M'; // Millions
  } else if (number >= 1e3) {
    return (number / 1e3).toFixed(0) + 'K'; // Thousands with no decimals
  } else {
    return number.toFixed(0); // For numbers under 1000, no suffix
  }
}

