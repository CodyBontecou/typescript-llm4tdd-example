import { exec } from 'child_process'

/**
 * Runs tests and returns a promise with the test results
 * @param command Optional test command to run (defaults to 'npm run test')
 * @returns Promise that resolves to an object with test results
 */
export function runTests(
    command: string = 'npm run test'
): Promise<{ passed: boolean; output: string }> {
    return new Promise(resolve => {
        console.log('Running tests...')

        exec(command, (_, stdout: string) => {
            // Check if all tests passed
            const passed =
                stdout.includes('✓') &&
                !stdout.includes('✗') &&
                !stdout.includes('fail')

            if (passed) {
                console.log('All tests passed successfully!')
            }

            resolve({ passed, output: stdout })
        })
    })
}
