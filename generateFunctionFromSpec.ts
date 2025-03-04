import { generateFunctionFromSpec } from './utils'

// Generate the function implementation from the test specification
generateFunctionFromSpec(
    './calculateDiscount.spec.ts',
    './calculateDiscount.ts'
)
    .then(content => {
        if (content) {
            console.log('Function implementation generated successfully')
        } else {
            console.error(
                'Failed to generate a passing function implementation'
            )
        }
    })
    .catch(error => {
        console.error('An error occurred:', error)
    })
