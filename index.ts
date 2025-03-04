import { generateFunctionFromSpec } from './utils'
import { formatPhoneNumberDoc } from './utils/constants/formatPhoneNumberDoc'
import { generateTestFromSkeleton } from './utils/generateTestFromSkeleton'
import { generateTestSkeletonFile } from './utils/generateTestSkeleton'

/**
 * Complete TDD workflow:
 * 1. Generate a test skeleton
 * 2. Generate a complete test from the skeleton
 * 3. Generate a function implementation that passes the tests
 */
async function runTDDWorkflow() {
    try {
        // Step 1: Generate a test skeleton
        const { testSuite, filePath } = await generateTestSkeletonFile(
            formatPhoneNumberDoc
        )

        // Step 2: Generate a complete test from the skeleton
        await generateTestFromSkeleton(filePath, filePath, formatPhoneNumberDoc)

        // Step 3: Generate a function implementation that passes the tests
        const outputFilePath = `./${testSuite.functionName}.ts`
        await generateFunctionFromSpec(filePath, outputFilePath)
    } catch (error) {
        console.error('Workflow failed:', error)
    }
}

// Run the TDD workflow
runTDDWorkflow()
