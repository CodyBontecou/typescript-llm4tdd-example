import {
    generateTestSkeletonFile,
    generateTestFromSkeleton,
    generateFunctionFromSpec,
} from './utils'
import { docGeneratorPrompt } from './utils/constants/docGeneratorPrompt'
import { formatPhoneNumberDoc } from './utils/constants/formatPhoneNumberDoc'
import { extractItStatements } from './utils/extractItStatements'

/**
 * Complete TDD workflow:
 * 1. Generate a test skeleton
 * 2. Generate a complete test from the skeleton
 * 3. Generate a function implementation that passes the tests
 */
export async function runTDDWorkflow() {
    try {
        // Step 1: Generate a test skeleton
        const { filePath } = await generateTestSkeletonFile(
            formatPhoneNumberDoc
        )

        // Step 2: Generate a complete test from the skeleton
        const testFileContent = await generateTestFromSkeleton(
            filePath,
            filePath
        )

        // Step 3: Extract it statements from testFile:
        if (testFileContent) {
            const itStatements = extractItStatements(testFileContent)

            // Step 4: Iterate over nodes
            itStatements.forEach(async (_, index) => {
                // for (const [index, _] of itStatements.entries()) {
                const { testSuite, filePath } = await generateTestSkeletonFile(
                    formatPhoneNumberDoc,
                    'gpt-4o-2024-08-06',
                    Math.floor(Math.random() * 1000000),
                    index
                )

                await generateTestFromSkeleton(filePath, filePath)

                const outputFilePath = `./${testSuite.functionName + index}.ts`
                const res = await generateFunctionFromSpec(
                    filePath,
                    outputFilePath
                )

                if (res?.passed) return
            })
        }
    } catch (error) {
        console.error('Workflow failed:', error)
    }
}

// Run the TDD workflow
runTDDWorkflow()
