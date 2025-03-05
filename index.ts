import { generateFunctionFromSpec } from './utils'

/**
 * Complete TDD workflow:
 * 1. Generate a function implementation that passes the tests
 */
async function runTDDWorkflow() {
    try {
        await generateFunctionFromSpec('add.spec.ts', 'add.ts')
    } catch (error) {
        console.error('Workflow failed:', error)
    }
}

// Run the TDD workflow
runTDDWorkflow()
