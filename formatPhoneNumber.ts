import { formatPhoneNumber } from './formatPhoneNumber';

function formatPhoneNumber(input: any): string {
  if (typeof input !== 'string') {
    throw new TypeError('Input must be a string');
  }
  
  // Removing all non-digit characters
  const cleaned = input.replace(/\D/g, '');
  
  if (cleaned.length !== 10) {
    throw new Error('ValueError: Phone number must be exactly 10 digits long');
  }
  
  const areaCode = cleaned.substring(0, 3);
  const exchangeCode = cleaned.substring(3, 6);
  
  if (areaCode[0] === '0' || areaCode[0] === '1') {
    throw new Error('ValueError: Area code cannot start with 0 or 1');
  }
  
  if (exchangeCode[0] === '0' || exchangeCode[0] === '1') {
    throw new Error('ValueError: Exchange code cannot start with 0 or 1');
  }
  
  return `(${areaCode}) ${exchangeCode}-${cleaned.substring(6)}`;
}

export { formatPhoneNumber };