import { generateTestSkeletonFile } from './utils'

// Generate a test skeleton file
generateTestSkeletonFile()
    .then(({ testSuite, filePath }) => {
        console.log(
            `Successfully generated test skeleton for function: ${testSuite.functionName}`
        )
        console.log(`File saved to: ${filePath}`)
        console.log(`Test cases: ${testSuite.testCases.length}`)
    })
    .catch(error => {
        console.error('An error occurred:', error)
    })
