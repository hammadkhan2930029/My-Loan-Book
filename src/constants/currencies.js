export const CURRENCY_OPTIONS = [
  {code: 'PKR', label: 'Pakistani Rupee'},
  {code: 'USD', label: 'US Dollar'},
  {code: 'SAR', label: 'Saudi Riyal'},
  {code: 'AED', label: 'UAE Dirham'},
  {code: 'QAR', label: 'Qatari Riyal'},
  {code: 'KWD', label: 'Kuwaiti Dinar'},
  {code: 'BHD', label: 'Bahraini Dinar'},
  {code: 'OMR', label: 'Omani Rial'},
  {code: 'JOD', label: 'Jordanian Dinar'},
  {code: 'IQD', label: 'Iraqi Dinar'},
  {code: 'EGP', label: 'Egyptian Pound'},
  {code: 'TRY', label: 'Turkish Lira'},
  {code: 'IRR', label: 'Iranian Rial'},
  {code: 'AFN', label: 'Afghan Afghani'},
  {code: 'INR', label: 'Indian Rupee'},
  {code: 'BDT', label: 'Bangladeshi Taka'},
  {code: 'NPR', label: 'Nepalese Rupee'},
  {code: 'LKR', label: 'Sri Lankan Rupee'},
  {code: 'CNY', label: 'Chinese Yuan'},
  {code: 'JPY', label: 'Japanese Yen'},
  {code: 'KRW', label: 'South Korean Won'},
  {code: 'PHP', label: 'Philippine Peso'},
  {code: 'IDR', label: 'Indonesian Rupiah'},
  {code: 'MYR', label: 'Malaysian Ringgit'},
  {code: 'SGD', label: 'Singapore Dollar'},
  {code: 'THB', label: 'Thai Baht'},
  {code: 'VND', label: 'Vietnamese Dong'},
  {code: 'EUR', label: 'Euro'},
  {code: 'GBP', label: 'British Pound'},
  {code: 'CHF', label: 'Swiss Franc'},
  {code: 'NOK', label: 'Norwegian Krone'},
  {code: 'SEK', label: 'Swedish Krona'},
  {code: 'DKK', label: 'Danish Krone'},
  {code: 'PLN', label: 'Polish Zloty'},
  {code: 'RUB', label: 'Russian Ruble'},
  {code: 'CAD', label: 'Canadian Dollar'},
  {code: 'MXN', label: 'Mexican Peso'},
  {code: 'BRL', label: 'Brazilian Real'},
  {code: 'ARS', label: 'Argentine Peso'},
  {code: 'AUD', label: 'Australian Dollar'},
  {code: 'NZD', label: 'New Zealand Dollar'},
  {code: 'ZAR', label: 'South African Rand'},
  {code: 'NGN', label: 'Nigerian Naira'},
  {code: 'KES', label: 'Kenyan Shilling'},
];

export const getCurrencyLabel = code =>
  CURRENCY_OPTIONS.find(currency => currency.code === code)?.label || code;

export const normalizeCurrencyInput = value =>
  String(value || '')
    .replace(/[^a-zA-Z]/g, '')
    .toUpperCase()
    .slice(0, 3);

export const filterCurrencyOptions = query => {
  const normalizedQuery = String(query || '').trim().toLowerCase();

  if (!normalizedQuery) {
    return CURRENCY_OPTIONS;
  }

  return CURRENCY_OPTIONS.filter(
    currency =>
      currency.code.toLowerCase().includes(normalizedQuery) ||
      currency.label.toLowerCase().includes(normalizedQuery),
  );
};
