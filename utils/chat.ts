import OpenAI from 'openai'
import { ChatCompletionMessageParam } from 'openai/resources'

const openai = new OpenAI()

export async function chat(messages: ChatCompletionMessageParam[]) {
    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages,
        })

        return completion.choices[0].message.content
    } catch (error) {
        console.error('Error:', error)
        return null
    }
}
