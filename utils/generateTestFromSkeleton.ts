import { ChatCompletionMessageParam } from 'openai/resources'
import { chat } from './chat'
import { readFileContent } from './readFileContent'
import { writeFileContent } from './writeFileContent'

/**
 * Generates a complete test file from a test skeleton using AI
 * @param skeletonFilePath Path to the test skeleton file
 * @param outputFilePath Path where the generated test should be saved (defaults to the same as skeleton path)
 * @param customPrompt Optional custom prompt to override the default one
 * @returns Promise that resolves to the generated content or null if generation failed
 */
export async function generateTestFromSkeleton(
    skeletonFilePath: string,
    outputFilePath?: string,
    customPrompt?: string
): Promise<string | null> {
    // Default prompt if none provided
    const defaultPrompt = `
    Use this Vitest test skeleton to finish writing the tests.

    Only return executable Typescript code
    Do not return Markdown output
    Do not wrap code in triple backticks
    Do not return YAML
    Do not include the single apostrophe character
`
    const prompt = customPrompt || defaultPrompt

    // Read the test skeleton file
    const testSpec = readFileContent(skeletonFilePath)
    if (!testSpec) {
        console.error(`Failed to read test skeleton from ${skeletonFilePath}`)
        return null
    }

    // Prepare messages for the AI
    const messages: ChatCompletionMessageParam[] = [
        {
            role: 'system',
            content: testSpec + prompt,
        },
    ]

    // Generate the test content
    const generatedContent = await chat(messages)

    // Save the generated content if available
    if (generatedContent) {
        const targetPath = outputFilePath || skeletonFilePath
        writeFileContent(targetPath, generatedContent)

        return generatedContent
    } else {
        console.error('No generated content received from AI')
        return null
    }
}
