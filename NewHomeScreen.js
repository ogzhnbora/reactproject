import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import fetchCryptoData from './CryptoData'; // API verisini çeken fonksiyon

const { width } = Dimensions.get('window');
const itemWidth = (width - 40 - 20) / 2; // Ekran genişliğini ikiye bölerek kutucuk genişliğini hesaplayalım, padding ve marginleri hesaba katarak

const NewHomeScreen = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [limit, setLimit] = useState(5);
  const navigation = useNavigation();

  const fetchData = async (newLimit) => {
    setLoading(true);
    const data = await fetchCryptoData(newLimit); // Sadece newLimit kadar coin göster
    setCryptoData(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData(limit);
  }, [limit]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData(limit).then(() => setRefreshing(false));
  }, [limit]);

  const handleViewMore = () => {
    setLimit(limit + 5); // 5 tane daha coin yükle
  };

  const handleCoinPress = (coinId) => {
    navigation.navigate('CoinDetails', { coinId });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.cryptoItem} onPress={() => handleCoinPress(item.id)}>
      <Text style={styles.cryptoSymbol}>{item.symbol}</Text>
      <Text style={styles.cryptoName}>{item.name}</Text>
      <Text style={styles.cryptoPrice}>${item.quote.USD.price.toFixed(2)}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cryptoData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.flatList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3498db" />
        }
        ListHeaderComponent={<Text style={styles.headerText}>Popüler Coinler</Text>}
        ListFooterComponent={
          <TouchableOpacity style={styles.button} onPress={handleViewMore}>
            <Text style={styles.buttonText}>Daha Fazla Göster</Text>
          </TouchableOpacity>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa', // Arka plan açık gri
    padding: 10,
  },
  flatList: {
    alignItems: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 20,
    textAlign: 'center',
  },
  cryptoItem: {
    width: itemWidth,
    padding: 20,
    margin: 10,
    backgroundColor: '#3498db', // Kutucuklar mavi
    borderRadius: 15,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cryptoSymbol: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff', // Beyaz metin
  },
  cryptoName: {
    fontSize: 16,
    color: '#fff', // Beyaz metin
    marginTop: 5,
  },
  cryptoPrice: {
    fontSize: 18,
    marginTop: 10,
    color: '#fff', // Beyaz metin
  },
  button: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#2ecc71', // Yeşil düğme
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default NewHomeScreen;
