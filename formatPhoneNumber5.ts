export function formatPhoneNumber(input: string | number): string {
  if (typeof input !== 'string') {
    throw new TypeError('Input must be a string');
  }

  const cleaned = input.replace(/[^\d]/g, '');

  if (cleaned.length !== 10) {
    throw new Error('Invalid length: Must be 10 digits after removing non-digit characters.');
  }

  const areaCode = cleaned.substring(0, 3);
  const exchangeCode = cleaned.substring(3, 4);

  if (areaCode.startsWith('0')) {
    throw new Error('Invalid area code: Cannot start with 0');
  }

  if (exchangeCode === '0') {
    throw new Error('Invalid exchange code: Cannot start with 0');
  }

  return `(${areaCode}) ${cleaned.substring(3, 6)}-${cleaned.substring(6)}`;
}