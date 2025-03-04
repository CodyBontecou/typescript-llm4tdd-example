export const formatPhoneNumberDoc = `Ticket: Format Phone Number Function
Objective: Implement a format_phone_number function that validates and formats U.S. phone numbers.

Functional Requirements
The function MUST adhere to the following rules. Tests should be written first for each criterion.

1. Input Validation
Parameter: phone (required, string).

Raise: TypeError if phone is not a string.

Return: Formatted phone number as a string (XXX) XXX-XXXX if valid.

Raise: ValueError with descriptive messages for invalid inputs (see Validation Rules).

2. Validation & Formatting Rules
Rule	Test Scenarios
A. Basic Structure	- Remove all non-digit characters (e.g., "123-456-7890" → "1234567890").
- Raise ValueError if cleaned number ≠ 10 digits.
B. Valid Area Code	- Area code (first 3 digits) cannot start with 0 or 1.
- Example: "0123456789" and "1987654321" are invalid.
C. Valid Exchange Code	- Exchange code (4th–6th digits) cannot start with 0 or 1.
- Example: "5550234567" is invalid.
D. Formatting	- Return formatted as (XXX) XXX-XXXX (e.g., "1234567890" → "(123) 456-7890").
Non-Functional Requirements
Error Messages:

ValueError("Invalid length: Must be 10 digits after removing non-digit characters.")

ValueError("Invalid area code: Cannot start with 0 or 1.")

ValueError("Invalid exchange code: Cannot start with 0 or 1.")

Performance:

Optimize for readability over extreme efficiency (no regex required).

Test-Driven Development Steps
Write Failing Tests:

Test valid/invalid lengths, area codes, exchange codes, and formatting.

Implement Incrementally:

Start with cleaning digits, then add validation checks, then formatting.

Edge Cases:

Test inputs like " (999) 000-123 " (valid after cleaning).

Test inputs with letters/symbols (e.g., "1-800-FLOWERS" → invalid length).

Example Test Cases
Input	Expected Result	Reason
"123-456-7890"	"(123) 456-7890"	Valid format and codes.
"0123456789"	ValueError (area code starts with 0)	Invalid area code.
"5550234567"	ValueError (exchange code starts with 0)	Invalid exchange code.
"123"	ValueError (length ≠ 10)	Too short after cleaning.
"(800) 222-3344"	"(800) 222-3344"	Valid (no cleaning needed).
Notes for Developer
Cleaning Logic: Strip all non-digit characters (e.g., +, -, , parentheses).

Edge Cases:

Test inputs with leading/trailing whitespace.

Test inputs like "0000000000" (invalid area code).

Assumptions:

Only validates U.S. numbers (no country code handling).

Exchange code rules follow U.S. telephony standards.

Deliverables:

A test suite covering all validation rules and edge cases.

The format_phone_number function that passes all tests.`
