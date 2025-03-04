import { describe, it, expect } from 'vitest'
import { processTransactions } from './transactionProcessor'

describe('processTransactions', () => {
    it('should correctly aggregate transactions by category', () => {
        // Arrange
        const transactions = [
            { id: '1', amount: 100, category: 'food', date: '2025-01-01' },
            { id: '2', amount: 200, category: 'transport', date: '2025-01-02' },
            { id: '3', amount: 50, category: 'food', date: '2025-01-03' },
            {
                id: '4',
                amount: 75,
                category: 'entertainment',
                date: '2025-01-04',
            },
            { id: '5', amount: 300, category: 'transport', date: '2025-01-05' },
        ]

        // Act
        const result = processTransactions(transactions)

        // Assert
        expect(result.categorySummary).toEqual({
            food: { total: 150, count: 2, average: 75 },
            transport: { total: 500, count: 2, average: 250 },
            entertainment: { total: 75, count: 1, average: 75 },
        })
    })

    it('should calculate correct totals and statistics', () => {
        // Arrange
        const transactions = [
            { id: '1', amount: 100, category: 'food', date: '2025-01-01' },
            { id: '2', amount: 200, category: 'transport', date: '2025-01-05' },
            { id: '3', amount: 50, category: 'food', date: '2025-01-10' },
        ]

        // Act
        const result = processTransactions(transactions)

        // Assert
        expect(result.totalAmount).toBe(350)
        expect(result.averageAmount).toBe(116.67)
        expect(result.transactionCount).toBe(3)
        expect(result.dateRange).toEqual({
            start: '2025-01-01',
            end: '2025-01-10',
            durationDays: 9,
        })
    })

    it('should handle empty array input', () => {
        // Arrange
        const transactions: any[] = []

        // Act
        const result = processTransactions(transactions)

        // Assert
        expect(result.categorySummary).toEqual({})
        expect(result.totalAmount).toBe(0)
        expect(result.averageAmount).toBe(0)
        expect(result.transactionCount).toBe(0)
        expect(result.dateRange).toBeNull()
    })

    it('should filter out negative amounts when flagged', () => {
        // Arrange
        const transactions = [
            { id: '1', amount: 100, category: 'food', date: '2025-01-01' },
            { id: '2', amount: -50, category: 'refund', date: '2025-01-02' },
            { id: '3', amount: 200, category: 'transport', date: '2025-01-03' },
            {
                id: '4',
                amount: -25,
                category: 'adjustment',
                date: '2025-01-04',
            },
        ]

        // Act
        const result = processTransactions(transactions, {
            filterNegativeAmounts: true,
        })

        // Assert
        expect(result.transactionCount).toBe(2)
        expect(result.totalAmount).toBe(300)
        expect(result.categorySummary).toEqual({
            food: { total: 100, count: 1, average: 100 },
            transport: { total: 200, count: 1, average: 200 },
        })
    })

    it('should sort transactions by date when specified', () => {
        // Arrange
        const transactions = [
            { id: '1', amount: 100, category: 'food', date: '2025-01-03' },
            { id: '2', amount: 200, category: 'transport', date: '2025-01-01' },
            { id: '3', amount: 50, category: 'food', date: '2025-01-05' },
        ]

        // Act
        const result = processTransactions(transactions, { sortByDate: true })

        // Assert
        expect(result.transactions).toEqual([
            { id: '2', amount: 200, category: 'transport', date: '2025-01-01' },
            { id: '1', amount: 100, category: 'food', date: '2025-01-03' },
            { id: '3', amount: 50, category: 'food', date: '2025-01-05' },
        ])
    })

    it('should properly handle decimal amounts', () => {
        // Arrange
        const transactions = [
            { id: '1', amount: 19.99, category: 'food', date: '2025-01-01' },
            { id: '2', amount: 45.5, category: 'food', date: '2025-01-02' },
        ]

        // Act
        const result = processTransactions(transactions)

        // Assert
        expect(result.totalAmount).toBeCloseTo(65.49, 2)
        expect(result.categorySummary.food.total).toBeCloseTo(65.49, 2)
        expect(result.categorySummary.food.average).toBeCloseTo(32.745, 3)
    })
})
