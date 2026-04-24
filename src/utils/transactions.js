const formatCurrencyValue = (amount, currency = 'PKR') => {
  try {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(Number(amount) || 0);
  } catch {
    return `${currency} ${Number(amount) || 0}`;
  }
};

export const formatTransactionAmount = (amount, type = 'gave', currency = 'PKR') => {
  const prefix = type === 'took' ? '+' : '-';

  return `${prefix}${formatCurrencyValue(amount, currency)}`;
};

export const formatTransactionDate = value => {
  if (!value) {
    return 'No date';
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Invalid date';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const getTransactionTitle = transaction =>
  transaction?.contactName || 'Transaction';

export const getTransactionSubtitle = transaction => {
  const parts = [formatTransactionDate(transaction?.transactionDate)];

  if (transaction?.dueDate) {
    parts.push(`Due ${formatTransactionDate(transaction.dueDate)}`);
  }

  if (transaction?.monthlyPaymentDay) {
    parts.push(`Monthly on ${transaction.monthlyPaymentDay}`);
  }

  if (transaction?.category === 'repayment') {
    parts.push(transaction?.status === 'pending' ? 'Repayment pending approval' : 'Repayment');
  }

  if (transaction?.note) {
    parts.push(transaction.note);
  }

  return parts.join(' - ');
};

export const mapTransactionToHistoryRow = transaction => ({
  id: transaction.id,
  title:
    transaction.category === 'repayment'
      ? `${getTransactionTitle(transaction)} repayment`
      : getTransactionTitle(transaction),
  date: formatTransactionDate(transaction.transactionDate),
  note: [
    transaction.dueDate ? `Due ${formatTransactionDate(transaction.dueDate)}` : '',
    transaction.monthlyPaymentDay ? `Monthly on ${transaction.monthlyPaymentDay}` : '',
    transaction.currency || 'PKR',
    transaction.note,
  ]
    .filter(Boolean)
    .join(' - '),
  amount: formatTransactionAmount(transaction.amount, transaction.type, transaction.currency),
  type: transaction.type,
});

export const mapTransactionToContactRow = transaction => ({
  id: transaction.id,
  title: `${
    transaction.category === 'repayment' ? 'Repayment' : 'Loan'
  } ${formatTransactionDate(transaction.transactionDate)}`,
  subtitle:
    [
      transaction.dueDate ? `Return by ${formatTransactionDate(transaction.dueDate)}` : '',
      transaction.monthlyPaymentDay ? `Monthly on ${transaction.monthlyPaymentDay}` : '',
      transaction.currency || 'PKR',
      transaction.note || '',
    ]
      .filter(Boolean)
      .join(' - ') || 'No note added',
  amount: formatTransactionAmount(transaction.amount, transaction.type, transaction.currency),
  type: transaction.type,
});

export const summarizeTransactions = transactions =>
  transactions.reduce(
    (summary, transaction) => {
      if (transaction.status === 'pending') {
        if (transaction.category === 'repayment') {
          if (transaction.type === 'gave') {
            summary.pendingRepaymentSent += Number(transaction.amount) || 0;
          } else {
            summary.pendingRepaymentReceived += Number(transaction.amount) || 0;
          }
        }

        return summary;
      }

      const amount = Number(transaction.amount) || 0;

      if (transaction.category === 'repayment') {
        if (transaction.type === 'took') {
          summary.collected += amount;
        } else {
          summary.repaid += amount;
        }
      } else if (transaction.type === 'took') {
        summary.took += amount;
      } else {
        summary.gave += amount;
      }

      summary.balance = summary.gave - summary.took;
      summary.remainingToReceive = Math.max(summary.gave - summary.collected, 0);
      summary.remainingToPay = Math.max(summary.took - summary.repaid, 0);

      return summary;
    },
    {
      collected: 0,
      gave: 0,
      took: 0,
      balance: 0,
      pendingRepaymentReceived: 0,
      pendingRepaymentSent: 0,
      remainingToPay: 0,
      remainingToReceive: 0,
      repaid: 0,
      currency: transactions[0]?.currency || 'PKR',
    },
  );

export const formatLedgerAmount = (amount, currency = 'PKR') =>
  formatCurrencyValue(amount, currency);
