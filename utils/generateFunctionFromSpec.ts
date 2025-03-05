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
 * @param spawnedNodes Number of instances of ChatGPT to spawn (default: 5)
 * @param testCommand Optional custom test command to run (default: 'npm run test')
 * @returns Promise that resolves to the generated content if successful, or null if all attempts failed
 */
export async function generateFunctionFromSpec(
    testFilePath: string,
    outputFilePath: string,
    testCommand?: string,
    customPrompt?: string
): Promise<{ response: string; passed: boolean } | undefined> {
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
    }

    // Prepare initial messages for the AI
    const messages: ChatCompletionMessageParam[] = [
        {
            role: 'system',
            content: prompt + testSpec,
        },
    ]

    // Generate the function implementation
    const response = await chat(messages)

    // Save and test the generated implementation
    if (response) {
        // Run the tests
        const { passed } = await runTests(testCommand)

        if (passed) {
            writeFileContent(outputFilePath, response)
            return { response, passed }
        } else {
            await runTDDWorkflow()
        }
    }
}
