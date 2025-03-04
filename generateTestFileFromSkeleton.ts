import OpenAI from 'openai'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { ChatCompletionMessageParam } from 'openai/resources'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const openai = new OpenAI()

const prompt = `
    Use this Vitest test skeleton to finish writing this test.
    Only return executable Typescript code
    Do not return Markdown output
    Do not wrap code in triple backticks
    Do not return YAML
    Do not include the single apostrophe character
`

const readFileContent = (filePath: string): string => {
    try {
        const absolutePath = path.resolve(__dirname, filePath)
        return fs.readFileSync(absolutePath, 'utf8')
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error)
        return ''
    }
}

const writeFileContent = (filePath: string, content: string): void => {
    try {
        const absolutePath = path.resolve(__dirname, filePath)
        fs.writeFileSync(absolutePath, content, 'utf8')
        console.log(`File ${filePath} updated successfully`)
    } catch (error) {
        console.error(`Error writing to file ${filePath}:`, error)
    }
}

const testSpec = readFileContent('./calculateDiscount.spec.ts')

const messages: ChatCompletionMessageParam[] = [
    {
        role: 'system',
        content: testSpec + prompt,
    },
]

const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages,
})

const generatedContent = completion.choices[0].message.content

if (generatedContent) {
    writeFileContent('./calculateDiscount.spec.ts', generatedContent)
} else {
    console.error('No generated content received from OpenAI')
}
