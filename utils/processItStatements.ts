import { Effect, pipe, Console } from 'effect'
import { extractItStatements } from './extractItStatements'
import { generateTestSkeletonFile } from './generateTestSkeleton'
import { formatPhoneNumberDoc } from './constants/formatPhoneNumberDoc'
import { generateTestFromSkeleton } from './generateTestFromSkeleton'
import { generateFunctionFromSpec } from '.'

export const processItStatements = (testFileContent: string) =>
    pipe(
        // Create effect with itStatements
        Effect.succeed(extractItStatements(testFileContent)),
        // Iterate over statements with Effect
        Effect.flatMap(itStatements =>
            Effect.all(
                itStatements.map((_, index) =>
                    Effect.gen(function* (_) {
                        // Generate test skeleton
                        const { testSuite, filePath } = yield* _(
                            Effect.promise(() =>
                                generateTestSkeletonFile(
                                    formatPhoneNumberDoc,
                                    'gpt-4o-2024-08-06',
                                    Math.floor(Math.random() * 1000000),
                                    index
                                )
                            )
                        )

                        // Generate tests from skeleton
                        yield* _(
                            Effect.promise(() =>
                                generateTestFromSkeleton(filePath, filePath)
                            )
                        )

                        // Generate function from spec
                        const outputFilePath = `./${
                            testSuite.functionName + index
                        }.ts`
                        const res = yield* _(
                            Effect.promise(() =>
                                generateFunctionFromSpec(
                                    filePath,
                                    outputFilePath
                                )
                            )
                        )

                        // Return if test passed
                        if (res?.passed) return Effect.succeed(res)
                        return Effect.fail(new Error('Test failed'))
                    }).pipe(
                        Effect.tapConsole('Processed test case'),
                        Effect.onInterrupt(() =>
                            Console.log('Interrupted test case processing')
                        )
                    )
                ),
                { concurrency: 'unbounded' } // Match forEach behavior
            )
        )
    )
