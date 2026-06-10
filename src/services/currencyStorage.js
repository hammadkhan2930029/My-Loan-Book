import AsyncStorage from '@react-native-async-storage/async-storage';

const SELECTED_CURRENCY_KEY = 'myloanbook_selected_currency';
const BASE_CURRENCY_KEY = 'myloanbook_base_currency';

export const saveSelectedCurrency = currency =>
  currency
    ? AsyncStorage.setItem(SELECTED_CURRENCY_KEY, currency)
    : AsyncStorage.removeItem(SELECTED_CURRENCY_KEY);

export const getSelectedCurrency = async () => {
  const currency = await AsyncStorage.getItem(SELECTED_CURRENCY_KEY);
  const normalizedCurrency = String(currency || '').trim().toUpperCase();

  return /^[A-Z]{3}$/.test(normalizedCurrency) ? normalizedCurrency : null;
};

export const saveBaseCurrency = currency =>
  currency
    ? AsyncStorage.setItem(BASE_CURRENCY_KEY, currency)
    : AsyncStorage.removeItem(BASE_CURRENCY_KEY);

export const getBaseCurrency = async () => {
  const currency = await AsyncStorage.getItem(BASE_CURRENCY_KEY);
  const normalizedCurrency = String(currency || '').trim().toUpperCase();

  return /^[A-Z]{3}$/.test(normalizedCurrency) ? normalizedCurrency : null;
};
