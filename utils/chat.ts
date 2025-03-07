import OpenAI from 'openai'
import { ChatCompletionMessageParam } from 'openai/resources'
import 'dotenv/config'

export const models = {
    anthropic: {
        model: 'claude-3-7-sonnet-20250219',
        baseURL: 'https://api.anthropic.com/v1/',
        apiKey: process.env.ANTHROPIC_API_KEY,
    },
    openai: {
        model: 'gpt-4o-2024-08-06',
        apiKey: process.env.OPENAI_API_KEY,
    },
    deepseek: {
        model: 'deepseek-reasoner',
        apiKey: process.env.DEEPSEEK_API_KEY,
    },
    ollama: {
        model: 'qwen2.5-coder:32b',
        url: 'http://localhost:11434/v1',
    },
}

export const openai = new OpenAI({ ...models.openai })

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
