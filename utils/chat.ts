import OpenAI from 'openai'
import { ChatCompletionMessageParam } from 'openai/resources'
import 'dotenv/config'

export const openai = new OpenAI({
    // baseURL: 'http://localhost:11434/v1',
    // apiKey: 'ollama',
})

const models = {
    openai: {
        model: 'gpt-4o-2024-08-06',
    },
    deepseek: {
        model: 'deepseek-reasoner',
    },
    qwen: {
        model: 'qwen2.5-coder:32b',
    },
}

export async function chat(messages: ChatCompletionMessageParam[]) {
    try {
        const completion = await openai.chat.completions.create({
            model: models.openai.model,
            messages,
        })

        return completion.choices[0].message.content
    } catch (error) {
        console.error('Error:', error)
        return null
    }
}
