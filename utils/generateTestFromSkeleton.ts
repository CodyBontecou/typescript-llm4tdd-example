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
    customPrompt?: string,
    additionalContext?: string
): Promise<string | null> {
    // Default prompt if none provided
    const defaultPrompt = `
    Generate a Typescript test in the following format:

    import { describe, it, expect } from 'vitest'

    describe('functionName', () => {
        it('does the thing you want', () => {})
        it("doesn't do the thing you're worried about", () => {})
    })

    I want the test to contain a function name within the describe block. Then provide as many it statements you believe is necessary to describe and test the function.

		${
            additionalContext ??
            'The function we will be testing does not exist but we will use this initial test file to guide the building of it.'
        }
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
            content: 'You are an advanced AI generating vitest tests.',
        },
        { role: 'user', content: testSpec + prompt },
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
