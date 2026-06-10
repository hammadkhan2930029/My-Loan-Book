import {apiRequest} from './apiClient';

export const getTransactions = ({contactId, currency, type} = {}) =>
  apiRequest('/transactions', {
    method: 'GET',
    params: {
      ...(contactId ? {contactId} : {}),
      ...(currency ? {currency} : {}),
      ...(type ? {type} : {}),
    },
  });

export const getTransaction = transactionId =>
  apiRequest(`/transactions/${transactionId}`, {
    method: 'GET',
  });

export const createTransaction = payload =>
  apiRequest('/transactions', {
    method: 'POST',
    data: payload,
  });

export const createRepaymentRequest = payload =>
  apiRequest('/transactions/repayment-requests', {
    method: 'POST',
    data: payload,
  });

export const confirmLoanRequest = transactionId =>
  apiRequest(`/transactions/${transactionId}/confirm-loan`, {
    method: 'PATCH',
  });

export const rejectLoanRequest = transactionId =>
  apiRequest(`/transactions/${transactionId}/reject-loan`, {
    method: 'PATCH',
  });

export const approveRepaymentRequest = transactionId =>
  apiRequest(`/transactions/${transactionId}/approve-repayment`, {
    method: 'PATCH',
  });
