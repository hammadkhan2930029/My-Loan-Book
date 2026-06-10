import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  getBaseCurrency,
  getSelectedCurrency,
  saveBaseCurrency,
  saveSelectedCurrency,
} from '@/services/currencyStorage';
import {
  areCurrenciesEqual,
  normalizeCurrencies,
  normalizeCurrency,
  resolveSelectedCurrency,
} from '@/utils/currency';

const CurrencyContext = createContext({
  baseCurrency: null,
  selectedCurrency: null,
  availableCurrencies: [],
  isCurrencyReady: false,
  setBaseCurrency: () => {},
  selectCurrency: () => {},
  syncAvailableCurrencies: () => {},
});

export const CurrencyProvider = ({children}) => {
  const [baseCurrency, setBaseCurrencyState] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [availableCurrencies, setAvailableCurrencies] = useState([]);
  const [isCurrencyReady, setIsCurrencyReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const restoreCurrency = async () => {
      try {
        const [savedBaseCurrency, savedCurrency] = await Promise.all([
          getBaseCurrency(),
          getSelectedCurrency(),
        ]);

        if (isMounted) {
          setBaseCurrencyState(savedBaseCurrency);
          setSelectedCurrency(savedBaseCurrency || savedCurrency);
          setAvailableCurrencies(
            savedBaseCurrency ? [savedBaseCurrency] : [],
          );
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

  const setBaseCurrency = useCallback(currency => {
    const normalizedCurrency = normalizeCurrency(currency);

    setBaseCurrencyState(normalizedCurrency);
    setSelectedCurrency(normalizedCurrency);
    setAvailableCurrencies(currentCurrencies =>
      normalizeCurrencies([normalizedCurrency, ...currentCurrencies]),
    );
    Promise.all([
      saveBaseCurrency(normalizedCurrency),
      saveSelectedCurrency(normalizedCurrency),
    ]).catch(() => {});
  }, []);

  const selectCurrency = useCallback(currency => {
    const normalizedCurrency = normalizeCurrency(currency);

    setSelectedCurrency(normalizedCurrency);
    saveSelectedCurrency(normalizedCurrency).catch(() => {});
  }, []);

  const syncAvailableCurrencies = useCallback(
    (currencies, serverSelectedCurrency = null) => {
      const normalizedCurrencies = normalizeCurrencies([
        baseCurrency,
        ...(Array.isArray(currencies) ? currencies : []),
      ]);
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
          serverSelectedCurrency:
            normalizedServerCurrency || baseCurrency,
        });

        if (nextCurrency !== currentCurrency) {
          saveSelectedCurrency(nextCurrency).catch(() => {});
        }

        return nextCurrency;
      });
    },
    [baseCurrency],
  );

  const value = useMemo(
    () => ({
      baseCurrency,
      selectedCurrency,
      availableCurrencies,
      isCurrencyReady,
      setBaseCurrency,
      selectCurrency,
      syncAvailableCurrencies,
    }),
    [
      availableCurrencies,
      baseCurrency,
      isCurrencyReady,
      setBaseCurrency,
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
