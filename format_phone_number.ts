import { format } from 'util'

export function format_phone_number(input: string): string {
    if (typeof input !== 'string') {
        throw new TypeError('Input must be a string')
    }

    // Remove non-digit characters
    const cleaned = input.replace(/\D/g, '')

    // Validate length
    if (cleaned.length !== 10) {
        throw new Error(
            'Invalid length: Must be 10 digits after removing non-digit characters.'
        )
    }

    const areaCode = cleaned.slice(0, 3)
    const exchangeCode = cleaned.slice(3, 6)

    // Validate area code and exchange code
    if (areaCode.startsWith('0')) {
        throw new Error('Invalid area code: Cannot start with 0')
    }
    if (exchangeCode.startsWith('0')) {
        throw new Error('Invalid exchange code: Cannot start with 0')
    }

    // Format and return the phone number
    return `(${areaCode}) ${exchangeCode}-${cleaned.slice(6)}`
}
