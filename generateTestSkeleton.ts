import OpenAI from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod'
import { z } from 'zod'

const openai = new OpenAI()

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

type TestSuit = z.infer<typeof TestSuiteSchema>

const prompt = `
	Generate a Typescript test in the following format:

	import { describe, it, expect } from 'vitest'

	describe('functionName', () => {
		it('does the thing you want', () => {})
		it("doesn't do the thing you're worried about", () => {})
	})

	I want the test to contain a function name within the describe block. Then provide as many it statements you believe is necessary to describe and test the function.

	The function we will be testing does not exist but we will use this initial test file to guide the building of it.

	Only return executable Typescript code
	Do not return Markdown output
	Do not wrap code in triple backticks
	Do not return YAML
	Do not include the single apostrophe character
`

const completion = await openai.beta.chat.completions.parse({
    model: 'gpt-4o-2024-08-06',
    messages: [{ role: 'system', content: prompt }],
    response_format: zodResponseFormat(TestSuiteSchema, 'testSkeleton'),
    seed: 42,
})

const testSkeletonJson = JSON.parse(completion.choices[0].message.content)
const testSkeleton: TestSuit = testSkeletonJson

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

import fs from 'fs'
fs.writeFileSync(`${testSkeleton.functionName}.spec.ts`, specContent.trim())

console.log(`Generated ${testSkeleton.functionName}.spec.ts`)
