import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors()); // Add this line to enable CORS for all routes

const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_KEY,
});

app.post('/api/translate', async (req, res) => {
  const { language, message } = req.body;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `Translate the following text provided into ${language}: ${message}.`,
      },
      {
        role: 'user',
        content: 'My name is Jane. What is yours?',
      },
    ],
    temperature: 0.7,
    max_tokens: 64,
    top_p: 1,
  });

  res.json(response);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
