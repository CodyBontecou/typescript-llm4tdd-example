import { generateTestFromSkeleton } from './utils'

// Generate the test file from the skeleton
generateTestFromSkeleton('./calculateDiscount.spec.ts')
    .then(content => {
        if (content) {
            console.log('Test file generated successfully')
        } else {
            console.error('Failed to generate test file')
        }
    })
    .catch(error => {
        console.error('An error occurred:', error)
    })
