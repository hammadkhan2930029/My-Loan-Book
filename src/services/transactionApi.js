import {apiRequest} from './apiClient';

export const getTransactions = ({contactId, type} = {}) =>
  apiRequest('/transactions', {
    method: 'GET',
    params: {
      ...(contactId ? {contactId} : {}),
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

export const approveRepaymentRequest = transactionId =>
  apiRequest(`/transactions/${transactionId}/approve-repayment`, {
    method: 'PATCH',
  });
