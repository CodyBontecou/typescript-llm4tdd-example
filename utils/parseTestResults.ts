/**
 * Parses test output to extract the number of failed and passed tests
 * @param testOutput - The test output string to parse
 * @returns An object containing the count of failed and passed tests
 */
export function parseTestResults(testOutput: string): {
    failed: number
    passed: number
} {
    // First check for the "no tests" pattern
    const noTestsRegex = /Tests\s+no tests/
    if (noTestsRegex.test(testOutput)) {
        return { failed: 0, passed: 0 }
    }

    // Use a regular expression to find the line with test results
    const testResultsRegex =
        /Tests\s+(\d+)\s+failed\s+\|\s+(\d+)\s+passed\s+\((\d+)\)/
    const match = testOutput.match(testResultsRegex)

    if (match) {
        const failed = parseInt(match[1], 10)
        const passed = parseInt(match[2], 10)

        return { failed, passed }
    }

    // Return default values if no match is found
    return { failed: 0, passed: 0 }
}
