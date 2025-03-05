export function formatPhoneNumber(phone: any): string {
  if (typeof phone !== 'string') {
    throw new TypeError('Input must be a string');
  }

  const cleanedPhone = phone.replace(/\D/g, '');
  
  if (cleanedPhone.length !== 10) {
    throw new Error('Invalid length: Must be 10 digits after removing non-digit characters.');
  }

  const areaCode = cleanedPhone.substring(0, 3);
  const exchangeCode = cleanedPhone.substring(3, 6);

  if (areaCode.startsWith('0')) {
    throw new Error('Invalid area code: Cannot start with 0');
  }

  if (exchangeCode.startsWith('0')) {
    throw new Error('Invalid exchange code: Cannot start with 0');
  }

  return `(${areaCode}) ${exchangeCode}-${cleanedPhone.substring(6)}`;
}