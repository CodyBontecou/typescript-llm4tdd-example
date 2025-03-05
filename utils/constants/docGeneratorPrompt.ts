import { formatPhoneNumberDoc } from './formatPhoneNumberDoc'

export const docGeneratorPrompt = `Ticket: Generate Test Documents
Objective: Implement a generateTestDoc function that generates test documents similar ${formatPhoneNumberDoc}.

Functional Requirements
The function MUST adhere to the following rules. Tests should be written first for each criterion.

1. Input Validation
Parameter: image (required, File | Blob).

Raise: TypeError if image is not a File | Blob.

Return: Boolean.

Raise: Error with descriptive messages for invalid inputs.

2. Validation & Formatting Rules
Rule Test Scenarios
A. Basic Structure	- Remove all special characters (e.g., "12'3" → "123").

Performance:

Optimize for readability over extreme efficiency (no regex required).

Test-Driven Development Steps
Write Failing Tests:

Test valid/invalid lengths, area codes, exchange codes, and formatting.

Implement Incrementally:

Start with cleaning digits, then add validation checks, then formatting.

Deliverables:

A test suite covering all validation rules and edge cases.

The generateTestDoc function that passes all tests.`
