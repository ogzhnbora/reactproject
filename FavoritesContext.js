import React, { createContext, useState, useContext } from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  const addFavorite = (coin) => {
    setFavorites([...favorites, coin]);
  };

  const removeFavorite = (coinId) => {
    setFavorites(favorites.filter((coin) => coin.id !== coinId));
  };

  const isFavorite = (coinId) => {
    return favorites.some((coin) => coin.id === coinId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
