import OpenAI from 'openai'
import { ChatCompletionMessageParam } from 'openai/resources'
import 'dotenv/config'

const openai = new OpenAI({
    // baseURL: 'https://api.deepseek.com',
    // apiKey: process.env.DEEPSEEK_API_KEY,
})

export async function chat(messages: ChatCompletionMessageParam[]) {
    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-2024-08-06',
            // model: 'deepseek-reasoner',
            messages,
        })

        return completion.choices[0].message.content
    } catch (error) {
        console.error('Error:', error)
        return null
    }
}
