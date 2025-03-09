import { ChatCompletionMessageParam } from 'openai/resources'
import { chat } from './chat'
import { readFileContent } from './readFileContent'
import { writeFileContent } from './writeFileContent'
import { runTests } from './runTests'

/**
 * Generates a function implementation from a test specification using AI
 * @param testFilePath Path to the test specification file
 * @param outputFilePath Path where the generated function should be saved
 * @param options Optional configuration parameters
 * @returns Promise that resolves to the generated content if successful, or null if all attempts failed
 */
export async function generateFunctionFromSpec(
    testFilePath: string,
    outputFilePath: string,
    options: {
        customPrompt?: string
        maxAttempts?: number
        testCommand?: string
    } = {}
): Promise<string | null> {
    const { customPrompt, maxAttempts = 5, testCommand } = options

    // Default prompt if none provided
    const basePrompt =
        customPrompt ||
        `
    Write a Typescript module that will make these tests pass and conforms to the passed conventions.

    Only return executable Typescript code
    Do not return Markdown output
    Do not wrap code in triple backticks
    Do not return YAML
`

    // Read the test specification file
    const testSpec = readFileContent(testFilePath)

    // Initialize message history
    const messages: ChatCompletionMessageParam[] = [
        { role: 'system', content: basePrompt + testSpec },
    ]

    // Try generating implementations until tests pass or max attempts reached
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        console.log(`\n--- Attempt ${attempt} ---`)

        // Generate the function implementation
        const response = await chat(messages)
        if (!response) {
            console.error('Failed to get a response from the AI.')
            break
        }

        // Save implementation and run tests
        writeFileContent(outputFilePath, response)
        const { passed, output } = await runTests(testCommand)

        // Update message history
        messages.push({ role: 'assistant', content: response })

        // Return successful implementation
        if (passed) {
            return response
        }

        // Add test failure information for retry
        messages.push({
            role: 'system',
            content:
                'Tests are failing with this output. Try again.\n\n' + output,
        })
    }

    return null
}
