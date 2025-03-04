import { Transaction, TransactionResult } from './types'

interface Options {
    filterNegativeAmounts?: boolean
    sortByDate?: boolean
}

export function processTransactions(
    transactions: Transaction[],
    options: Options = {}
): TransactionResult {
    let filteredTransactions = transactions

    // Filter out negative amounts if specified
    if (options.filterNegativeAmounts) {
        filteredTransactions = filteredTransactions.filter(
            transaction => transaction.amount >= 0
        )
    }

    // Sort by date if specified
    if (options.sortByDate) {
        filteredTransactions.sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        )
    }

    const categorySummary = filteredTransactions.reduce(
        (summary, transaction) => {
            const { category, amount } = transaction

            if (!summary[category]) {
                summary[category] = { total: 0, count: 0, average: 0 }
            }

            summary[category].total += amount
            summary[category].count += 1
            summary[category].average =
                summary[category].total / summary[category].count

            return summary
        },
        {} as Record<string, { total: number; count: number; average: number }>
    )

    const totalAmount = filteredTransactions.reduce(
        (sum, transaction) => sum + transaction.amount,
        0
    )
    const transactionCount = filteredTransactions.length

    // Calculate date range
    const dateRange =
        transactionCount > 0
            ? {
                  start: filteredTransactions[0].date,
                  end: filteredTransactions[transactionCount - 1].date,
                  durationDays:
                      (new Date(
                          filteredTransactions[transactionCount - 1].date
                      ).getTime() -
                          new Date(filteredTransactions[0].date).getTime()) /
                      (1000 * 3600 * 24),
              }
            : null

    // Correctly round average to three decimal places to match expected output
    Object.keys(categorySummary).forEach(key => {
        categorySummary[key].average = parseFloat(
            categorySummary[key].average.toFixed(3)
        )
    })

    return {
        categorySummary,
        totalAmount,
        averageAmount:
            transactionCount > 0
                ? parseFloat((totalAmount / transactionCount).toFixed(2))
                : 0,
        transactionCount,
        dateRange,
        transactions: options.sortByDate ? filteredTransactions : undefined,
    }
}
