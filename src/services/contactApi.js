import {apiRequest} from './apiClient';

export const getContacts = () =>
  apiRequest('/contacts', {
    method: 'GET',
  });

export const getContact = contactId =>
  apiRequest(`/contacts/${contactId}`, {
    method: 'GET',
  });

export const addContactByRegCode = ({regCode}) =>
  apiRequest('/contacts', {
    method: 'POST',
    data: {
      reg_code: regCode,
    },
  });
