import OpenAI from 'openai'
import * as fs from 'fs'
import * as path from 'path'
import { exec } from 'child_process'
import { fileURLToPath } from 'url'
import { ChatCompletionMessageParam } from 'openai/resources'

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const openai = new OpenAI()

const INITIAL_PROMPT =
    'Write a Typescript module that will make these tests pass and conforms to the passed conventions'
const RETRY_PROMPT = 'Tests are failing with this output. Try again.'
const CONVENTION_TEXT = `Only return executable Typescript code
Do not return Markdown output
Do not wrap code in triple backticks
Do not return YAML`

// Read file content programmatically
const readFileContent = (filePath: string): string => {
    try {
        const absolutePath = path.resolve(__dirname, filePath)
        return fs.readFileSync(absolutePath, 'utf8')
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error)
        return ''
    }
}

// Read the test file
const GET_ADD_SPEC = readFileContent('./transactionProcessor.spec.ts')

const messages: ChatCompletionMessageParam[] = [
    {
        role: 'system',
        content: INITIAL_PROMPT + CONVENTION_TEXT + GET_ADD_SPEC,
    },
]

async function chat() {
    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages,
        })

        return completion.choices[0].message.content
    } catch (error) {
        console.error('Error:', error)
        return null
    }
}

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
                content: RETRY_PROMPT + '\n\n' + testOutput,
            })
        }

        const response = await chat()

        // Write the response to add.ts
        if (response) {
            fs.writeFileSync('./transactionProcessor.ts', response, 'utf8')

            // Run the tests
            const testResult = await runTests()
            testsPassed = testResult.passed
            testOutput = testResult.output

            // If tests passed, break out of the loop
            if (testsPassed) {
                console.log(`\nSuccess! Tests passed on attempt ${attempt}`)
                break
            }

            // Add the AI's response to the message history
            messages.push({
                role: 'assistant',
                content: response,
            })

            console.log(`\nTests failed on attempt ${attempt}. Retrying...`)
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
