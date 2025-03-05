import { ChatCompletionMessageParam } from 'openai/resources'
import { chat } from './chat'
import { readFileContent } from './readFileContent'
import { writeFileContent } from './writeFileContent'
import { runTests } from './runTests'

/**
 * Generates a function implementation from a test specification using AI
 * @param testFilePath Path to the test specification file
 * @param outputFilePath Path where the generated function should be saved
 * @param customPrompt Optional custom prompt to override the default one
 * @param maxAttempts Maximum number of attempts to generate a passing implementation (default: 5)
 * @param testCommand Optional custom test command to run (default: 'npm run test')
 * @returns Promise that resolves to the generated content if successful, or null if all attempts failed
 */
export async function generateFunctionFromSpec(
    testFilePath: string,
    outputFilePath: string,
    customPrompt?: string,
    maxAttempts: number = 5,
    testCommand?: string
): Promise<string | null> {
    // Default prompt if none provided
    const defaultPrompt = `
    Write a Typescript module that will make these tests pass and conforms to the passed conventions.

    Only return executable Typescript code
    Do not return Markdown output
    Do not wrap code in triple backticks
    Do not return YAML
`
    const prompt = customPrompt || defaultPrompt
    const retryPrompt = 'Tests are failing with this output. Try again.'

    // Read the test specification file
    const testSpec = readFileContent(testFilePath)

    // Attach content of the spec file to prompt
    const messages: ChatCompletionMessageParam[] = [
        {
            role: 'system',
            content: prompt + testSpec,
        },
    ]

    // Main execution loop
    let testsPassed = false
    let attempt = 0
    let testOutput = ''
    let generatedContent: string | null = null

    while (!testsPassed && attempt < maxAttempts) {
        attempt++
        console.log(`\n--- Attempt ${attempt} ---`)

        // If this is a retry, add the test output to the messages
        if (attempt > 1 && testOutput) {
            messages.push({
                role: 'system',
                content: retryPrompt + '\n\n' + testOutput,
            })
        }

        // Generate the function implementation
        const response = await chat(messages)

        // Save and test the generated implementation
        if (response) {
            generatedContent = response
            writeFileContent(outputFilePath, response)

            // Run the tests
            const testResult = await runTests(testCommand)
            testsPassed = testResult.passed
            testOutput = testResult.output

            // Add the AI's response to the message history
            messages.push({
                role: 'assistant',
                content: response,
            })
        } else {
            console.error('Failed to get a response from the AI.')
            break
        }
    }

    return testsPassed ? generatedContent : null
}
