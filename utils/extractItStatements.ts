/**
 * Extracts all 'it' statements from a test file as strings in an array
 * @param testFileContent The content of the test file as a string
 * @returns An array of strings, each containing a complete 'it' statement
 */
export function extractItStatements(testFileContent: string): string[] {
    if (!testFileContent) {
        return []
    }

    const results: string[] = []

    // Regular expression to match 'it' statements
    // This regex looks for:
    // 1. The 'it' keyword followed by opening parenthesis
    // 2. Captures everything until the closing parenthesis and semicolon
    // 3. Handles nested parentheses within the statement
    const itRegex =
        /it\s*\(\s*(['"`])(.+?)\1\s*,\s*(\(\s*\)\s*=>|function\s*\(\s*\)\s*)\s*{([\s\S]*?)}\s*\)\s*;/g

    let match
    while ((match = itRegex.exec(testFileContent)) !== null) {
        // Extract the full matched 'it' statement
        const fullMatch = match[0]
        results.push(fullMatch)
    }

    return results
}
