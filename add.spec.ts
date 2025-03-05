import { describe, it, expect } from 'vitest'
import { add } from './add'

describe('add function', () => {
    it('should return the sum of multiple numbers', () => {
        expect(add(1, 2, 3)).toBe(6)
    })

    it('should return 0 if no arguments are passed', () => {
        expect(add()).toBe(0)
    })

    it('should return the same number if one number is passed', () => {
        expect(add(5)).toBe(5)
    })

    it('should handle negative numbers', () => {
        expect(add(-1, -2, -3)).toBe(-6)
    })
})
