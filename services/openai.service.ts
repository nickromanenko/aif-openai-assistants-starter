import 'dotenv/config';
import OpenAI from 'openai';
const openai = new OpenAI();
export async function createThread() {
    const thread = await openai.beta.threads.create();
    return thread.id;
}

export async function sendMessage(threadId: string, content: string) {
    // Create Message
    const message = await openai.beta.threads.messages.create(threadId, {
        role: 'user',
        content,
    });
    // Create a run
    const run = await openai.beta.threads.runs.createAndPoll(threadId, {
        assistant_id: process.env.OPENAI_ASSISTANT_ID!,
        instructions: 'Please address the user as Jane Doe. The user has a premium account.',
    });
    const messages = await openai.beta.threads.messages.list(run.thread_id);
    const data = messages.data;
    // Return the last message
    return data[data.length - 1].content;
}
