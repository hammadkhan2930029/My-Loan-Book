import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  getSelectedCurrency,
  saveSelectedCurrency,
} from '@/services/currencyStorage';
import {
  areCurrenciesEqual,
  normalizeCurrencies,
  normalizeCurrency,
  resolveSelectedCurrency,
} from '@/utils/currency';

const CurrencyContext = createContext({
  selectedCurrency: null,
  availableCurrencies: [],
  isCurrencyReady: false,
  selectCurrency: () => {},
  syncAvailableCurrencies: () => {},
});

export const CurrencyProvider = ({children}) => {
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [availableCurrencies, setAvailableCurrencies] = useState([]);
  const [isCurrencyReady, setIsCurrencyReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const restoreCurrency = async () => {
      try {
        const savedCurrency = await getSelectedCurrency();

        if (isMounted) {
          setSelectedCurrency(savedCurrency);
        }
      } finally {
        if (isMounted) {
          setIsCurrencyReady(true);
        }
      }
    };

    restoreCurrency();

    return () => {
      isMounted = false;
    };
  }, []);

  const selectCurrency = useCallback(currency => {
    const normalizedCurrency = normalizeCurrency(currency);

    setSelectedCurrency(normalizedCurrency);
    saveSelectedCurrency(normalizedCurrency).catch(() => {});
  }, []);

  const syncAvailableCurrencies = useCallback(
    (currencies, serverSelectedCurrency = null) => {
      const normalizedCurrencies = normalizeCurrencies(currencies);
      const normalizedServerCurrency = normalizeCurrency(
        serverSelectedCurrency,
      );

      setAvailableCurrencies(currentCurrencies =>
        areCurrenciesEqual(currentCurrencies, normalizedCurrencies)
          ? currentCurrencies
          : normalizedCurrencies,
      );
      setSelectedCurrency(currentCurrency => {
        const nextCurrency = resolveSelectedCurrency({
          availableCurrencies: normalizedCurrencies,
          currentCurrency,
          serverSelectedCurrency: normalizedServerCurrency,
        });

        if (nextCurrency !== currentCurrency) {
          saveSelectedCurrency(nextCurrency).catch(() => {});
        }

        return nextCurrency;
      });
    },
    [],
  );

  const value = useMemo(
    () => ({
      selectedCurrency,
      availableCurrencies,
      isCurrencyReady,
      selectCurrency,
      syncAvailableCurrencies,
    }),
    [
      availableCurrencies,
      isCurrencyReady,
      selectCurrency,
      selectedCurrency,
      syncAvailableCurrencies,
    ],
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
