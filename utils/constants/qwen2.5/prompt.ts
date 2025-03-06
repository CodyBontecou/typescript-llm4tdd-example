export const prompt = `Write a Typescript module that will make these tests pass and conforms to the passed conventions.

    Only return executable Typescript code
		This code must be exported
		Do not return text
    Do not return Markdown output
    Do not wrap code in triple backticks
    Do not return YAML
		Do not include the single apostrophe character



import { describe, it, expect } from 'vitest'
import { formatPhoneNumber } from './formatPhoneNumber';

describe('formatPhoneNumber', () => {

  it('Valid input with dashes', () => {
    const input = '123-456-7890';
    const expectedOutput = '(123) 456-7890';
    expect(formatPhoneNumber(input)).toBe(expectedOutput);
  });

  it('Valid input with spaces', () => {
    const input = '123 456 7890';
    const expectedOutput = '(123) 456-7890';
    expect(formatPhoneNumber(input)).toBe(expectedOutput);
  });

  it('Valid input with parentheses', () => {
    const input = '(123) 456 7890';
    const expectedOutput = '(123) 456-7890';
    expect(formatPhoneNumber(input)).toBe(expectedOutput);
  });

  it('Input with non-digit characters', () => {
    const input = '123-abc-7890';
    expect(() => formatPhoneNumber(input)).toThrowError('Invalid length');
  });

  it('Area code starts with 0', () => {
    const input = '023-456-7890';
    expect(() => formatPhoneNumber(input)).toThrowError('Invalid area code');
  });

  it('Area code starts with 1', () => {
    const input = '123-456-7890';
    expect(() => formatPhoneNumber(input)).toThrowError('Invalid area code');
  });

  it('Exchange code starts with 0', () => {
    const input = '123-056-7890';
    expect(() => formatPhoneNumber(input)).toThrowError('Invalid exchange code');
  });

  it('Exchange code starts with 1', () => {
    const input = '123-156-7890';
    expect(() => formatPhoneNumber(input)).toThrowError('Invalid exchange code');
  });

  it('Valid input without any non-digit characters', () => {
    const input = '1234567890';
    const expectedOutput = '(123) 456-7890';
    expect(formatPhoneNumber(input)).toBe(expectedOutput);
  });

  it('Input length less than 10 digits after cleaning', () => {
    const input = '123';
    expect(() => formatPhoneNumber(input)).toThrowError('Invalid length');
  });

  it('Input length more than 10 digits after cleaning', () => {
    const input = '1234567890123';
    expect(() => formatPhoneNumber(input)).toThrowError('Invalid length');
  });
});
`
