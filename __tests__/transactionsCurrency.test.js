import {summarizeTransactions} from '../src/utils/transactions';

describe('selected-currency transaction summary', () => {
  test('never adds mixed currencies when selected currency is provided', () => {
    const summary = summarizeTransactions(
      [
        {
          amount: 5000,
          category: 'loan',
          currency: 'PKR',
          status: 'approved',
          type: 'gave',
        },
        {
          amount: 100,
          category: 'loan',
          currency: 'USD',
          status: 'approved',
          type: 'gave',
        },
        {
          amount: 20,
          category: 'repayment',
          currency: 'USD',
          status: 'confirmed',
          type: 'took',
        },
      ],
      'USD',
    );

    expect(summary.currency).toBe('USD');
    expect(summary.gave).toBe(100);
    expect(summary.collected).toBe(20);
    expect(summary.remainingToReceive).toBe(80);
  });

  test('returns selected-currency zero summary for no matching rows', () => {
    const summary = summarizeTransactions(
      [
        {
          amount: 5000,
          category: 'loan',
          currency: 'PKR',
          status: 'approved',
          type: 'gave',
        },
      ],
      'AED',
    );

    expect(summary.currency).toBe('AED');
    expect(summary.gave).toBe(0);
    expect(summary.took).toBe(0);
    expect(summary.balance).toBe(0);
  });
});
