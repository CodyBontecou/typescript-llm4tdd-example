import {
    generateTestSkeletonFile,
    generateTestFromSkeleton,
    generateFunctionFromSpec,
} from './utils'
import { formatPhoneNumberDoc } from './utils/constants/formatPhoneNumberDoc'

/**
 * Complete TDD workflow:
 * 1. Generate a test skeleton
 * 2. Generate a complete test from the skeleton
 * 3. Generate a function implementation that passes the tests
 */
async function runTDDWorkflow() {
    try {
        console.log('=== LLM4TDD Workflow ===')
        console.log('Step 1: Generating test skeleton...')

        // Step 1: Generate a test skeleton
        const { testSuite, filePath } = await generateTestSkeletonFile(
            formatPhoneNumberDoc
        )
        console.log(
            `Generated test skeleton for function: ${testSuite.functionName}`
        )

        // Step 2: Generate a complete test from the skeleton
        console.log('\nStep 2: Generating complete test from skeleton...')
        const generatedTest = await generateTestFromSkeleton(filePath, filePath)

        if (!generatedTest) {
            throw new Error('Failed to generate complete test from skeleton')
        }
        console.log(`Test file generated successfully: ${filePath}`)

        // Step 3: Generate a function implementation that passes the tests
        console.log('\nStep 3: Generating function implementation...')
        const outputFilePath = `./${testSuite.functionName}.ts`
        const generatedFunction = await generateFunctionFromSpec(
            filePath,
            outputFilePath
        )

        if (!generatedFunction) {
            throw new Error(
                'Failed to generate a passing function implementation'
            )
        }
        console.log(
            `Function implementation generated successfully: ${outputFilePath}`
        )

        console.log('\n=== Workflow Complete ===')
        console.log(`Generated function: ${testSuite.functionName}`)
        console.log(`Test file: ${filePath}`)
        console.log(`Implementation file: ${outputFilePath}`)
    } catch (error) {
        console.error('Workflow failed:', error)
    }
}

// Run the TDD workflow
runTDDWorkflow()
