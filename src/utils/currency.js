export const normalizeCurrency = currency => {
  const normalizedCurrency = String(currency || '').trim().toUpperCase();

  return /^[A-Z]{3}$/.test(normalizedCurrency) ? normalizedCurrency : null;
};

export const normalizeCurrencies = currencies =>
  Array.from(
    new Set(
      (Array.isArray(currencies) ? currencies : [])
        .map(normalizeCurrency)
        .filter(Boolean),
    ),
  );

export const areCurrenciesEqual = (currentCurrencies, nextCurrencies) =>
  currentCurrencies.length === nextCurrencies.length &&
  currentCurrencies.every(
    (currency, index) => currency === nextCurrencies[index],
  );

export const resolveSelectedCurrency = ({
  availableCurrencies,
  currentCurrency,
  serverSelectedCurrency,
}) => {
  const normalizedCurrencies = normalizeCurrencies(availableCurrencies);
  const normalizedCurrentCurrency = normalizeCurrency(currentCurrency);
  const normalizedServerCurrency = normalizeCurrency(serverSelectedCurrency);

  return (
    (normalizedCurrentCurrency &&
    normalizedCurrencies.includes(normalizedCurrentCurrency)
      ? normalizedCurrentCurrency
      : null) ||
    (normalizedServerCurrency &&
    normalizedCurrencies.includes(normalizedServerCurrency)
      ? normalizedServerCurrency
      : null) ||
    normalizedCurrencies[0] ||
    null
  );
};

export const getAdjacentCurrency = ({
  availableCurrencies,
  direction,
  selectedCurrency,
}) => {
  const normalizedCurrencies = normalizeCurrencies(availableCurrencies);

  if (normalizedCurrencies.length <= 1) {
    return normalizedCurrencies[0] || null;
  }

  const normalizedSelectedCurrency = normalizeCurrency(selectedCurrency);
  const currentIndex = Math.max(
    normalizedCurrencies.indexOf(normalizedSelectedCurrency),
    0,
  );
  const offset = direction === 'previous' ? -1 : 1;
  const nextIndex =
    (currentIndex + offset + normalizedCurrencies.length) %
    normalizedCurrencies.length;

  return normalizedCurrencies[nextIndex];
};
