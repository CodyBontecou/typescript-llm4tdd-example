export const passwordValidationDoc = `Ticket: Password Validation Function
Objective: Implement a validate_password function that enforces security rules for user passwords.

Functional Requirements
The function MUST adhere to the following rules. Write tests for each criterion first, then implement logic to pass the tests.

1. Input Validation
Parameter: password (required, string).

Parameter: common_passwords (optional, list of strings, defaults to ['password', '123456', 'qwerty', 'abc123']).

Raise: TypeError if password is not a string.

Return: True if valid, False otherwise.

2. Validation Rules
Rule	Test Scenarios
A. Minimum Length	- Fails for passwords < 8 characters (e.g., "Ab1!").
- Passes for ≥8 (e.g., "Abcdef1!").
B. Character Types	- Fails if missing: uppercase, lowercase, digit, or special character (!@#$%^&*()).
- Passes if all four types are present (e.g., "Abc123!").
C. Common Passwords	- Fails if password exists in common_passwords (case-sensitive).
- Uses default list if none provided.
D. Sequential Chars	- Fails for 3+ identical consecutive chars (e.g., "aaaB1!x").
- Fails for 3+ increasing consecutive chars (e.g., "abcD2@y" or "123eF#z").
E. Whitespace	- Fails if any whitespace exists (e.g., spaces, tabs, newlines in "Ab 1!xyz").
Non-Functional Requirements
Error Handling:

Raise TypeError for non-string password inputs (e.g., None, integers, lists).

Performance:

Optimize for efficiency (e.g., early termination on failed checks).

Test-Driven Development Steps
Write Failing Tests First:

Create test cases for all scenarios under Validation Rules (A–E).

Include edge cases (e.g., exactly 8 chars, sequential chars at start/end).

Implement Function Incrementally:

Write code to pass one test group at a time (e.g., first handle length checks, then character types).

Refactor:

Optimize code after tests pass, ensuring no regressions.

Example Test Cases
Input	common_passwords	Expected Result	Reason
"Abc123!"	Default	False	Missing special character !@#$%^&*() (rule B).
"AAAbcdef1!"	Default	False	Three consecutive As (rule D).
"Password123!"	["Password123!"]	False	Exists in common_passwords (rule C).
"A1b!cdef"	Default	True	Meets all criteria.
Notes for Developer
Edge Cases: Test passwords like "aB1!aaaa" (valid length/symbols but fails due to 4x a).

Case Sensitivity: common_passwords checks are case-sensitive (e.g., "Password" ≠ "password").

Sequential Checks: Consecutive increasing sequences include letters ("abc") and numbers ("123").

Deliverables:

A complete test suite covering all validation rules.

The validate_password function passing all tests.`
