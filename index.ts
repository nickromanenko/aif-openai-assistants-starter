import 'dotenv/config';
import express, { Request, Response, Router } from 'express';
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

router.post('/chat', async (req: Request, res: Response) => {
    const { message } = req.body;
    const response = await sendMessage(message);
    return res.json({ response });
});

app.use(router);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
});
