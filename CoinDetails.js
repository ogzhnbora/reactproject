import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { LineChart } from 'react-native-chart-kit';
import { useFavorites } from './FavoritesContext'; // Favoriler contextini kullan

const CoinDetails = ({ route }) => {
  const { coinId } = route.params;
  const [coinData, setCoinData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [priceData, setPriceData] = useState([]);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  const fetchPriceHistory = async () => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 30);

      const response = await axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/ohlcv/historical`, {
        headers: {
          'X-CMC_PRO_API_KEY': '73627c33-3590-468e-a41e-2b900e5064ee',
        },
        params: {
          id: coinId,
          convert: 'USD',
          time_start: Math.floor(startDate.getTime() / 1000),
          time_end: Math.floor(endDate.getTime() / 1000),
        },
      });

      const prices = response.data.data.quotes.map(quote => ({
        date: new Date(quote.time_open).toLocaleDateString(),
        value: quote.quote.USD.close,
      }));
      setPriceData(prices);
    } catch (error) {
      console.error('Error fetching price history:', error);
    }
  };

  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        const response = await axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/info`, {
          headers: {
            'X-CMC_PRO_API_KEY': '73627c33-3590-468e-a41e-2b900e5064ee',
          },
          params: {
            id: coinId,
          },
        });
        const quoteResponse = await axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest`, {
          headers: {
            'X-CMC_PRO_API_KEY': '73627c33-3590-468e-a41e-2b900e5064ee',
          },
          params: {
            id: coinId,
            convert: 'USD',
          },
        });
        const quoteData = quoteResponse.data.data[coinId];
        setCoinData({ ...response.data.data[coinId], quote: quoteData.quote });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching coin data:', error);
        setLoading(false);
      }
    };

    fetchCoinData();
    fetchPriceHistory();
  }, [coinId]);

  const handleFavoriteToggle = () => {
    if (isFavorite(coinId)) {
      removeFavorite(coinId);
    } else {
      addFavorite({ id: coinId, name: coinData.name, symbol: coinData.symbol });
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!coinData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading coin data</Text>
      </View>
    );
  }

  const chartConfig = {
    backgroundColor: '#fff',
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#000',
    },
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: `https://s2.coinmarketcap.com/static/img/coins/64x64/${coinId}.png` }} style={styles.coinLogo} />
      <Text style={styles.coinName}>{coinData.name} ({coinData.symbol})</Text>
      <Text style={styles.coinPrice}>${coinData.quote.USD.price.toFixed(2)}</Text>
      <Text style={styles.coinDescription}>{coinData.description}</Text>
      <TouchableOpacity style={styles.favoriteButton} onPress={handleFavoriteToggle}>
        <Text style={styles.favoriteButtonText}>
          {isFavorite(coinId) ? 'Remove from Favorites' : 'Add to Favorites'}
        </Text>
      </TouchableOpacity>
      {priceData.length > 0 && (
        <LineChart
          data={{
            labels: priceData.map(p => p.date),
            datasets: [
              {
                data: priceData.map(p => p.value),
              },
            ],
          }}
          width={Dimensions.get('window').width - 40}
          height={220}
          chartConfig={chartConfig}
          style={{
            marginVertical: 20,
            borderRadius: 16,
          }}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f2f5',
    alignItems: 'center',
  },
  coinLogo: {
    width: 64,
    height: 64,
    marginBottom: 20,
  },
  coinName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  coinPrice: {
    fontSize: 22,
    color: '#333',
    marginBottom: 20,
  },
  coinDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  favoriteButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#3498db',
    borderRadius: 10,
  },
  favoriteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
});

export default CoinDetails;
