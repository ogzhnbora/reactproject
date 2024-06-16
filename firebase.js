import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase konfigürasyon bilgilerinizi buraya ekleyin
const firebaseConfig = {
    apiKey: "AIzaSyDpOdoOQjN-l1MMIOOu5URuHBiQQk8dWjU",
    authDomain: "react-native-trading.firebaseapp.com",
    projectId: "react-native-trading",
    storageBucket: "react-native-trading.appspot.com",
    messagingSenderId: "154800393751",
    appId: "1:154800393751:web:89194567e4c57fc64d5652"
};

// Firebase uygulamasını başlat
const app = initializeApp(firebaseConfig);

// Firebase Auth'ı AsyncStorage ile başlat
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { auth };
