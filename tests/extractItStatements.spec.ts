import { describe, it, expect } from 'vitest'
import { extractItStatements } from '../utils/extractItStatements'

describe('extractItStatements', () => {
    it('extracts it statements from test file content', () => {
        const testFileContent = `
      import { describe, it, expect } from 'vitest';
      import { formatPhoneNumber } from './formatPhoneNumber';

      describe('formatPhoneNumber', () => {
        it('Valid format returns formatted number', () => {
          expect(formatPhoneNumber('123-456-7890')).toBe('(123) 456-7890');
        });

        it('Valid format with parentheses returns formatted number', () => {
          expect(formatPhoneNumber('(800) 222-3344')).toBe('(800) 222-3344');
        });
      });
    `

        const result = extractItStatements(testFileContent)

        expect(result).toHaveLength(2)
        expect(result[0]).toContain('Valid format returns formatted number')
        expect(result[1]).toContain(
            'Valid format with parentheses returns formatted number'
        )
    })

    it('handles empty input', () => {
        expect(extractItStatements('')).toEqual([])
    })

    it('handles input with no it statements', () => {
        const content = `
      import { describe } from 'vitest';

      describe('Something', () => {
        // No it statements here
      });
    `
        expect(extractItStatements(content)).toEqual([])
    })

    it('handles it statements with different quote styles', () => {
        const content = `
      it("Double quotes test", () => {});
      it('Single quotes test', () => {});
      it(\`Template literal test\`, () => {});
    `

        const result = extractItStatements(content)

        expect(result).toHaveLength(3)
        expect(result[0]).toContain('Double quotes test')
        expect(result[1]).toContain('Single quotes test')
        expect(result[2]).toContain('Template literal test')
    })

    it('handles it statements with function syntax', () => {
        const content = `
      it('Using function syntax', function() {
        // Test code
      });
    `

        const result = extractItStatements(content)

        expect(result).toHaveLength(1)
        expect(result[0]).toContain('Using function syntax')
    })
})
