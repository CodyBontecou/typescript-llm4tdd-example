import { add } from './add'
import { describe, expect, it } from 'vitest'

describe.skip('add', () => {
    it('can add two numbers', () => {
        expect(add(1, 2)).toEqual(3)
    })

    it('can add three numbers', () => {
        expect(add(1, 2, 3)).toEqual(6)
    })
})
