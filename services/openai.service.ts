import 'dotenv/config';
import OpenAI from 'openai';
const openai = new OpenAI();
export async function createThread() {
    const thread = await openai.beta.threads.create();
    return thread.id;
}

export async function sendMessage(threadId: string, content: string) {
    // Create Message
    await openai.beta.threads.messages.create(threadId, {
        role: 'user',
        content,
    });
    // Create a run
    const run = await openai.beta.threads.runs.createAndPoll(threadId, {
        assistant_id: process.env.OPENAI_ASSISTANT_ID!,
    });
    const messages = await openai.beta.threads.messages.list(run.thread_id);
    const data = messages.data;
    const response: any = data[0].content[0];
    console.log(response.text);
    const responseText = response.text.value.replace(/【.*?】/g, '');
    return responseText;
}
