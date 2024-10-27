import 'dotenv/config';
import express, { Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator';
import { createThread, sendMessage } from './services/openai.service';
import { errorHandler } from './utils/error-handler';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
const router = Router();

router.get('/start', async (req: Request, res: Response) => {
    const threadId = await createThread();
    return res.json({ thread_id: threadId });
});

router.post('/chat', [body('message').notEmpty(), body('thread_id').notEmpty()], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const data: { thread_id: string; message: string } = req.body;
    const response = await sendMessage(data.thread_id, data.message);
    return res.json({ response });
});

app.use(router);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
});
