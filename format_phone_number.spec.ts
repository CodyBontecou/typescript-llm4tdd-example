import { describe, it, expect } from 'vitest'
import { format_phone_number } from './format_phone_number'

describe('format_phone_number', () => {
    it('Valid phone number with hyphens to be formatted correctly', () => {
        const result = format_phone_number('123-456-7890')
        expect(result).toBe('(123) 456-7890')
    })

    it('Invalid phone number with area code starting with 0', () => {
        expect(() => format_phone_number('023-456-7890')).toThrow(
            'Invalid area code: Cannot start with 0'
        )
    })

    it('Invalid phone number with exchange code starting with 0', () => {
        expect(() => format_phone_number('123-056-7890')).toThrow(
            'Invalid exchange code: Cannot start with 0'
        )
    })

    it('Invalid phone number due to insufficient length after cleaning', () => {
        expect(() => format_phone_number('123-45')).toThrow(
            'Invalid length: Must be 10 digits after removing non-digit characters.'
        )
    })

    it('Valid phone number with whitespace and parentheses to be formatted correctly', () => {
        const result = format_phone_number('(800) 222-3344')
        expect(result).toBe('(800) 222-3344')
    })

    it('Invalid phone number "0000000000" due to invalid area code', () => {
        expect(() => format_phone_number('0000000000')).toThrow(
            'Invalid area code: Cannot start with 0'
        )
    })

    it('Input is not a string, should raise TypeError', () => {
        expect(() => format_phone_number(1234567890 as any)).toThrow(
            'Input must be a string'
        )
    })
})
