import axios from 'axios';

class CryptoPriceProvider {
    private apiUrl: string;

    constructor() {
        this.apiUrl = 'https://api.coingecko.com/api/v3';
    }

    public async getPrices(symbols: string[]): Promise<{ [key: string]: number }> {
        try {
            console.log("salut");
            
            const response = await axios.get(`${this.apiUrl}/simple/price`, {
                params: {
                    ids: symbols.join(','),
                    vs_currencies: 'usd'
                }
            });

            const prices: { [key: string]: number } = {};
            symbols.forEach(symbol => {
                if (response.data[symbol] && response.data[symbol].usd) {
                    prices[symbol] = response.data[symbol].usd;
                } else {
                    prices[symbol] = NaN; // Or handle missing prices as needed
                }
            });

            console.log(prices);
            
            return prices;
        } catch (error) {
            console.error(`Failed to fetch prices:`, error);
            throw new Error('Failed to fetch prices');
        }
    }
}

export default CryptoPriceProvider;
