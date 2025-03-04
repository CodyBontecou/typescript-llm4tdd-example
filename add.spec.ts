import { describe, it, expect } from 'vitest';
import { add } from './add'; // Ensure this matches the filename of the module where the add function is defined

describe('add function', () => {
    it('should return the sum of all numbers', () => {
        expect(add(1, 2, 3)).toBe(6);
        expect(add(10, -10, 5)).toBe(5);
        expect(add()).toBe(0); // no arguments should return 0
    });

    it('should handle negative numbers', () => {
        expect(add(-1, -2, -3)).toBe(-6);
    });
});