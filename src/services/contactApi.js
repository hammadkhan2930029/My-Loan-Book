import {apiRequest} from './apiClient';

export const getContacts = ({currency} = {}) =>
  apiRequest('/contacts', {
    method: 'GET',
    params: {
      ...(currency ? {currency} : {}),
    },
  });

export const getContact = (contactId, {currency} = {}) =>
  apiRequest(`/contacts/${contactId}`, {
    method: 'GET',
    params: {
      ...(currency ? {currency} : {}),
    },
  });

export const addContactByRegCode = ({currency, regCode}) =>
  apiRequest('/contacts', {
    method: 'POST',
    params: {
      ...(currency ? {currency} : {}),
    },
    data: {
      reg_code: regCode,
    },
  });
