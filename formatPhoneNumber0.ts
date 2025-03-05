export function formatPhoneNumber(input: any): string {
  if (typeof input !== 'string') {
    throw new TypeError('Input must be a string');
  }

  const cleaned = input.replace(/\D/g, '');

  if (cleaned.length !== 10) {
    throw new Error('Invalid length: Must be 10 digits after removing non-digit characters.');
  }

  const areaCode = cleaned.substring(0, 3);
  const exchangeCode = cleaned.substring(3, 6);
  const lineNumber = cleaned.substring(6, 10);

  if (areaCode.startsWith('0')) {
    throw new Error('Invalid area code: Cannot start with 0');
  }

  if (exchangeCode.startsWith('0')) {
    throw new Error('Invalid exchange code: Cannot start with 0');
  }
  
  return `(${areaCode}) ${exchangeCode}-${lineNumber}`;
}