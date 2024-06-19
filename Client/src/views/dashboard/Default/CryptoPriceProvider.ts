import axios from 'axios';

const CryptoPriceProvider = {
  getPriceData: async (cryptoIds:any) => {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
        params: {
          ids: cryptoIds.join(','), // join the array of crypto IDs into a comma-separated string
          vs_currencies: 'usd',
          include_24hr_change: 'true',
        include_last_updated_at: 'true'

        }
      });
      return response.data; // return the entire response data
    } catch (error) {
      console.error('Error fetching price data:', error);
      throw error;
    }
  },


};

export default CryptoPriceProvider;
