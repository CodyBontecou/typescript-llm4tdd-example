import { describe, it, expect } from 'vitest'
import { formatPhoneNumber } from './formatPhoneNumber';

describe('formatPhoneNumber', () => {
  
  it('Valid phone number with mixed characters', () => {
    // Returns '(123) 456-7890' for input '123-456-7890'
  });

  it('Phone number with invalid area code '0'', () => {
    // Raises ValueError for input '0123456789' due to invalid area code
  });

  it('Phone number with invalid exchange code '0'', () => {
    // Raises ValueError for input '5550234567' due to invalid exchange code
  });

  it('Phone number shorter than 10 digits', () => {
    // Raises ValueError for input '123' due to invalid length
  });

  it('Valid phone number with no need for cleaning', () => {
    // Returns '(800) 222-3344' for input '(800) 222-3344'
  });

  it('Phone number with leading/trailing whitespace', () => {
    // Returns '(999) 000-1234' for input ' (999) 000-1234 '
  });

  it('Non-numeric input with letters and symbols', () => {
    // Raises ValueError for input '1-800-FLOWERS' due to invalid length
  });

  it('Phone number with only zeros in area code', () => {
    // Raises ValueError for input '0000000000' due to invalid area code
  });
});