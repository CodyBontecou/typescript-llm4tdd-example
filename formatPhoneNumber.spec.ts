import { describe, it, expect } from 'vitest'
import { formatPhoneNumber } from './formatPhoneNumber';

describe('formatPhoneNumber', () => {
  
  it('should raise TypeError if input is not a string', () => {
    // throws TypeError for non-string input
  });

  it('should return formatted number for a valid input without special characters', () => {
    // returns (123) 456-7890 for 1234567890
  });

  it('should return formatted number for a valid input with hyphens', () => {
    // returns (123) 456-7890 for 123-456-7890
  });

  it('should raise ValueError for numbers shorter than 10 digits after cleaning', () => {
    // throws ValueError for input of 123
  });

  it('should raise ValueError for numbers longer than 10 digits after cleaning', () => {
    // throws ValueError for input of 1234567890123
  });

  it('should raise ValueError for area code starting with 0', () => {
    // throws ValueError for 0123456789
  });

  it('should raise ValueError for area code starting with 1', () => {
    // throws ValueError for 1987654321
  });

  it('should raise ValueError for exchange code starting with 0', () => {
    // throws ValueError for 5550234567
  });

  it('should raise ValueError for exchange code starting with 1', () => {
    // throws ValueError for 5551234567
  });

  it('should handle input with leading and trailing whitespace', () => {
    // returns (123) 456-7890 for input '   123-456-7890   '
  });

  it('should handle input with special characters', () => {
    // returns (800) 222-3344 for input '(800) 222-3344'
  });

  it('should raise ValueError for input with letters resulting in invalid length', () => {
    // throws ValueError for input '1-800-FLOWERS'
  });

  it('should handle mixture of spaces and numbers correctly', () => {
    // returns (999) 000-1234 for input '  (999) 000-1234 '
  });
});