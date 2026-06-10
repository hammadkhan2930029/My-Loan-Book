const mockStorage = new Map();

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(key => Promise.resolve(mockStorage.get(key) || null)),
  removeItem: jest.fn(key => {
    mockStorage.delete(key);
    return Promise.resolve();
  }),
  setItem: jest.fn((key, value) => {
    mockStorage.set(key, value);
    return Promise.resolve();
  }),
}));

import {
  getBaseCurrency,
  getSelectedCurrency,
  saveBaseCurrency,
  saveSelectedCurrency,
} from '../src/services/currencyStorage';

describe('currency storage', () => {
  beforeEach(() => {
    mockStorage.clear();
  });

  test('restores selected currency after save', async () => {
    await saveSelectedCurrency('USD');

    await expect(getSelectedCurrency()).resolves.toBe('USD');
  });

  test('persists and restores base currency', async () => {
    await saveBaseCurrency('SAR');

    await expect(getBaseCurrency()).resolves.toBe('SAR');
  });

  test('clears persisted currency when selection is empty', async () => {
    await saveSelectedCurrency('AED');
    await saveSelectedCurrency(null);

    await expect(getSelectedCurrency()).resolves.toBeNull();
  });

  test('ignores invalid persisted currency', async () => {
    mockStorage.set('myloanbook_selected_currency', 'invalid');

    await expect(getSelectedCurrency()).resolves.toBeNull();
  });
});
