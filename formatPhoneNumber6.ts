export class ValueError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValueError';
  }
}

export function formatPhoneNumber(input: string): string {
  const cleaned = input.replace(/\D/g, '');
  
  if (cleaned.length !== 10) {
    throw new ValueError('Invalid length');
  }

  const areaCode = cleaned.substring(0, 3);
  const exchangeCode = cleaned.substring(3, 6);
  const subscriberNumber = cleaned.substring(6);

  if (!/^[2-9]\d{2}$/.test(areaCode)) {
    throw new ValueError('Invalid area code');
  }

  if (!/^[2-9]\d{2}$/.test(exchangeCode)) {
    throw new ValueError('Invalid exchange code');
  }

  return `(${areaCode}) ${exchangeCode}-${subscriberNumber}`;
}