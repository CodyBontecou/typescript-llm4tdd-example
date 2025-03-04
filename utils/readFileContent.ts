import * as fs from 'fs'
import * as path from 'path'
const __dirname = path.dirname(__filename)

// Read file content programmatically
export const readFileContent = (filePath: string): string => {
    try {
        const absolutePath = path.resolve(__dirname, filePath)
        return fs.readFileSync(absolutePath, 'utf8')
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error)
        return ''
    }
}
