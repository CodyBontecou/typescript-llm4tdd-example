import { ChatCompletionMessageParam } from 'openai/resources'
import { chat } from './chat'
import { readFileContent } from './readFileContent'
import { writeFileContent } from './writeFileContent'
import { runTests } from './runTests'
import { runTDDWorkflow } from '..'

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
		Do not return text
    Do not return Markdown output
    Do not wrap code in triple backticks
    Do not return YAML
		Do not include the single apostrophe character
`
    const prompt = customPrompt || defaultPrompt

    // Read the test specification file
    const testSpec = readFileContent(testFilePath)
    if (!testSpec) {
        console.error(`Failed to read test specification from ${testFilePath}`)
        return null
    }

    // Prepare initial messages for the AI
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
    let parsedTestResults = { failed: 0, passed: 0 }
    let generatedContent: string | null = null
    const weirdTests =
        parsedTestResults.failed <= parsedTestResults.passed ||
        [1, 2].includes(parsedTestResults.failed) ||
        (parsedTestResults.failed !== 0 && parsedTestResults.passed !== 0)

    while (!testsPassed && attempt < maxAttempts) {
        attempt++
        console.log(`\n--- Attempt ${attempt} ---`)

        // If this is a retry, add the test output to the messages
        if (attempt > 1 && testOutput) {
            const functionFileContent = readFileContent(outputFilePath)
            const testFileContent = readFileContent(testFilePath)

            messages.push({
                role: 'system',
                content: `Tests are failing with this output: ${testOutput}.
								Here's the code of the function that produces the output: ${functionFileContent}
								Here's the code of the test file: ${testFileContent}
								`,
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
            parsedTestResults = testResult.parsedTestResults

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

    if (testsPassed) {
        return generatedContent
    } else {
        await runTDDWorkflow()
    }

    return testsPassed ? generatedContent : null
}
