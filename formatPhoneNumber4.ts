export class ValueError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValueError";
  }
}

export function formatPhoneNumber(input: string): string {
  // Remove all non-digit characters
  const digits = input.replace(/\D/g, '');

  if (digits.length !== 10) {
    throw new ValueError('Phone number must be exactly 10 digits');
  }

  const areaCode = digits.substring(0, 3);
  const exchangeCode = digits.substring(3, 6);
  const lineNumber = digits.substring(6, 10);

  // Area code and exchange code should not start with 0 or 1
  if (areaCode[0] === '0' || areaCode[0] === '1') {
    throw new ValueError('Invalid area code');
  }
  if (exchangeCode[0] === '0' || exchangeCode[0] === '1') {
    throw new ValueError('Invalid exchange code');
  }

  return `(${areaCode}) ${exchangeCode}-${lineNumber}`;
}