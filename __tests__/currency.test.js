import {
  getAdjacentCurrency,
  normalizeCurrencies,
  resolveSelectedCurrency,
} from '../src/utils/currency';

describe('currency helpers', () => {
  test('normalizes and removes duplicate currencies', () => {
    expect(normalizeCurrencies(['pkr', 'USD', 'PKR', '', 'bad-code'])).toEqual([
      'PKR',
      'USD',
    ]);
  });

  test('keeps a restored currency when it remains available', () => {
    expect(
      resolveSelectedCurrency({
        availableCurrencies: ['PKR', 'USD', 'AED'],
        currentCurrency: 'USD',
        serverSelectedCurrency: 'PKR',
      }),
    ).toBe('USD');
  });

  test('falls back to first available when saved currency is unavailable', () => {
    expect(
      resolveSelectedCurrency({
        availableCurrencies: ['PKR', 'USD'],
        currentCurrency: 'AED',
        serverSelectedCurrency: 'AED',
      }),
    ).toBe('PKR');
  });

  test('cycles dashboard swipe next and previous with wraparound', () => {
    expect(
      getAdjacentCurrency({
        availableCurrencies: ['PKR', 'USD', 'AED'],
        direction: 'next',
        selectedCurrency: 'AED',
      }),
    ).toBe('PKR');
    expect(
      getAdjacentCurrency({
        availableCurrencies: ['PKR', 'USD', 'AED'],
        direction: 'previous',
        selectedCurrency: 'PKR',
      }),
    ).toBe('AED');
  });

  test('does not change currency when only one is available', () => {
    expect(
      getAdjacentCurrency({
        availableCurrencies: ['PKR'],
        direction: 'next',
        selectedCurrency: 'PKR',
      }),
    ).toBe('PKR');
  });

  test('returns null for no transactions state', () => {
    expect(
      resolveSelectedCurrency({
        availableCurrencies: [],
        currentCurrency: 'USD',
        serverSelectedCurrency: null,
      }),
    ).toBeNull();
  });
});
