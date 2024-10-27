import cors from 'cors';
import 'dotenv/config';
import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { createThread, sendMessage } from './services/openai.service';
import { errorHandler } from './utils/error-handler';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Routes
// Get a new thread id
app.get('/start', async (req: Request, res: Response) => {
    const threadId = await createThread();
    return res.json({ thread_id: threadId });
});

// Send a message to the thread
app.post('/chat', [body('message').notEmpty(), body('thread_id').notEmpty()], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    console.log('[CHAT] Request body:', JSON.stringify(req.body));

    const data: { thread_id: string; message: { text: string } } = req.body;
    const response = await sendMessage(data.thread_id, data.message.text);
    return res.json({ response });
});

app.use(errorHandler);

app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
});
