const defaultUrl: string = "https://binance.com/api/v3/ticker/price?symbol=BTCUSDT";

/**
 * Fetches the current price of a given symbol from Binance and returns
 * an object with the symbol, price, and time.
 * @param {string} [url] The URL to fetch, defaults to Binance's BTCUSDT price
 * @returns {Promise<{symbol: string, price: number, time: string}>}
 */
export async function fetchPrice(url: string = defaultUrl): Promise<{symbol: string, price: number, time: string}> {
    const response = await fetch(url);
    const data = await response.json();
    

    return {
        symbol: data.symbol,
        price: parseFloat(data.price),
        time: new Date().toISOString()
    }
}           

