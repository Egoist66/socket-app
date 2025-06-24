let lastPrice: null | number = null;

/**
 * Checks if the given price is different from the last recorded price.
 * 
 * @param {number} newPrice - The new price to compare against the last price.
 * @returns {boolean} - Returns true if the new price is different from the last price; otherwise, false.
 */

export function isUpdated(newPrice: number): boolean {
    return newPrice !== lastPrice;
}

/**
 * Updates the last recorded price to the given new price.
 * 
 * @param {number} newPrice - The new price to be recorded as the last price.
 */

export function updateLastPrice(newPrice: number): void {
    lastPrice = newPrice;
}