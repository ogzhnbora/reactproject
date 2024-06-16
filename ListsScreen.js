import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useFavorites } from './FavoritesContext'; // Favoriler contextini kullan

const ListsScreen = ({ navigation }) => {
  const { favorites, removeFavorite } = useFavorites();

  const handleCoinPress = (coinId) => {
    navigation.navigate('CoinDetails', { coinId });
  };

  const renderItem = ({ item }) => (
    <View style={styles.coinItem}>
      <TouchableOpacity onPress={() => handleCoinPress(item.id)}>
        <Text style={styles.coinText}>{item.name} ({item.symbol})</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => removeFavorite(item.id)}>
        <Text style={styles.removeText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Favorite Coins</Text>
      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <Text style={styles.emptyText}>No favorite coins added.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  coinItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#3498db',
    borderRadius: 10,
  },
  coinText: {
    fontSize: 18,
    color: '#fff',
  },
  removeText: {
    fontSize: 16,
    color: 'red',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ListsScreen;
