import axios from 'axios';

const fetchCryptoData = async (limit) => {
  try {
    const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
      headers: {
        'X-CMC_PRO_API_KEY': '73627c33-3590-468e-a41e-2b900e5064ee',
      },
      params: {
        start: '1',
        limit: limit,
        convert: 'USD',
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    return [];
  }
};

export default fetchCryptoData;
