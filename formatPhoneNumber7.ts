export class ValueError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValueError';
  }
}

export function formatPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  
  if (digits.length !== 10) {
    throw new ValueError('Invalid phone number length');
  }

  const areaCode = digits.slice(0, 3);
  const exchangeCode = digits.slice(3, 6);

  if (areaCode[0] === '0' || areaCode[0] === '1') {
    throw new ValueError('Invalid area code');
  }

  if (exchangeCode[0] === '0' || exchangeCode[0] === '1') {
    throw new ValueError('Invalid exchange code');
  }

  return `(${areaCode}) ${exchangeCode}-${digits.slice(6)}`;
}