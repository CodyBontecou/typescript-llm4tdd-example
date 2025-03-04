import * as fs from 'fs'
import { exec } from 'child_process'

import { readFileContent } from './utils/readFileContent'
import { ChatCompletionMessageParam } from 'openai/resources'
import { chat } from './utils/chat'

const prompt = `
	Write a Typescript module that will make these tests pass and conforms to the passed conventions.

	Only return executable Typescript code
	Do not return Markdown output
	Do not wrap code in triple backticks
	Do not return YAML
`
const retryPrompt = 'Tests are failing with this output. Try again.'

// Read the test file
const getAddSpec = readFileContent('./calculateDiscount.spec.ts')

const messages: ChatCompletionMessageParam[] = [
    {
        role: 'system',
        content: prompt + getAddSpec,
    },
]

// Function to run tests and return a promise with the test results
function runTests(): Promise<{ passed: boolean; output: string }> {
    return new Promise(resolve => {
        console.log('Running tests...')

        exec(
            'npm run test',
            (error: Error | null, stdout: string, stderr: string) => {
                let testOutput = stdout

                if (error) {
                    testOutput += `\nError: ${error.message}`
                }

                if (stderr) {
                    console.error(`Test stderr: ${stderr}`)
                    testOutput += `\nStderr: ${stderr}`
                }

                console.log(`Test results:\n${stdout}`)

                // Check if all tests passed
                const passed =
                    stdout.includes('✓') &&
                    !stdout.includes('✗') &&
                    !stdout.includes('fail')

                if (passed) {
                    console.log('All tests passed successfully!')
                } else {
                    console.log(
                        'Some tests failed. Check the output above for details.'
                    )
                }

                resolve({ passed, output: testOutput })
            }
        )
    })
}

// Main execution function
async function main() {
    let testsPassed = false
    let attempt = 0
    let testOutput = ''

    while (!testsPassed) {
        attempt++
        console.log(`\n--- Attempt ${attempt} ---`)

        // If this is a retry, add the test output to the messages
        if (attempt > 1 && testOutput) {
            messages.push({
                role: 'user',
                content: retryPrompt + '\n\n' + testOutput,
            })
        }

        const response = await chat(messages)

        // Write the response to add.ts
        if (response) {
            fs.writeFileSync('./calculateDiscount.ts', response, 'utf8')

            // Run the tests
            const testResult = await runTests()
            testsPassed = testResult.passed
            testOutput = testResult.output

            // Add the AI's response to the message history
            messages.push({
                role: 'assistant',
                content: response,
            })
        } else {
            console.error('Failed to get a response from the AI. Exiting.')
            break
        }
    }
}

// Start the process
main().catch(error => {
    console.error('An error occurred:', error)
})
