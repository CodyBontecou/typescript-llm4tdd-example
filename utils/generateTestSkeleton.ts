import OpenAI from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod'
import { z } from 'zod'
import 'dotenv/config'

import { writeFileContent } from './writeFileContent'

// Define schemas for the test structure
const TestCaseSchema = z.object({
    description: z
        .string()
        .describe('Brief description of what the test case verifies'),
    assertion: z
        .string()
        .optional()
        .describe(
            "Specific assertion being tested (e.g., 'returns true for valid input')"
        ),
})

const TestSuiteSchema = z
    .object({
        functionName: z.string().describe('Name of the function being tested'),
        testCases: z
            .array(TestCaseSchema)
            .describe('List of positive and negative test cases'),
    })
    .describe('Test suite structure for a specific function')

export type TestSuite = z.infer<typeof TestSuiteSchema>

/**
 * Generates a test skeleton using AI and saves it to a file
 * @param customPrompt Optional custom prompt to override the default one
 * @param model OpenAI model to use (default: 'gpt-4o-2024-08-06')
 * @param seed Optional seed for reproducible results
 * @returns Promise that resolves to the generated test suite object
 */
export async function generateTestSkeleton(
    customPrompt?: string,
    model: string = 'gpt-4o-2024-08-06',
    seed?: number,
    additionalContext?: string
): Promise<TestSuite> {
    const openai = new OpenAI({
        // baseURL: 'https://api.deepseek.com',
        // apiKey: process.env.DEEPSEEK_API_KEY,
    })

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


    Only return executable Typescript code
    Do not return Markdown output
    Do not wrap code in triple backticks
    Do not return YAML
    Do not include the single apostrophe character
`
    const prompt = customPrompt || defaultPrompt

    // Generate the test skeleton using OpenAI
    const completion = await openai.beta.chat.completions.parse({
        model,
        messages: [{ role: 'system', content: prompt }],
        response_format: zodResponseFormat(TestSuiteSchema, 'testSkeleton'),
        seed,
    })

    const testSkeletonJson = JSON.parse(completion.choices[0].message.content)
    const testSkeleton: TestSuite = testSkeletonJson

    return testSkeleton
}

/**
 * Generates a test skeleton and saves it to a file
 * @param customPrompt Optional custom prompt to override the default one
 * @param model OpenAI model to use (default: 'gpt-4o-2024-08-06')
 * @param seed Optional seed for reproducible results
 * @returns Promise that resolves to the generated test suite object and file path
 */
export async function generateTestSkeletonFile(
    customPrompt?: string,
    model: string = 'gpt-4o-2024-08-06',
    seed: number = Math.floor(Math.random() * 1000000),
    index?: number
): Promise<{ testSuite: TestSuite; filePath: string }> {
    // Generate the test skeleton
    const testSkeleton = await generateTestSkeleton(customPrompt, model, seed)

    // Generate the full spec file content
    const specContent = `
import { describe, it, expect } from 'vitest'
import { ${testSkeleton.functionName} } from './${testSkeleton.functionName}';

describe('${testSkeleton.functionName}', () => {
  ${testSkeleton.testCases
      .map(
          testCase => `
  it('${testCase.description}', () => {
    // ${testCase.assertion}
  });`
      )
      .join('\n')}
});
`

    // Write the spec file
    const filePath = `${
        testSkeleton.functionName + (index ? index : '')
    }.spec.ts`
    writeFileContent(filePath, specContent.trim())

    console.log(`Generated ${filePath}`)

    return { testSuite: testSkeleton, filePath }
}
