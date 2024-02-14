import express from 'express'
import OpenAI from 'openai'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

const app = express();
const port = process.env.PORT || 3000;

const openai = new OpenAI({
  apiKey: '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',
});

app.use(express.json());

// Enable CORS for all routes
app.use(cors());

app.post('/api/translate', async (req, res) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: req.body.messages,
      temperature: 0.7,
      max_tokens: 64,
      top_p: 1,
    });

    res.json({ response: response.choices[0].message.content });
    console.log(response.choices[0].message.content)
  } catch (error) {
    console.error(error);

    if (error.response && error.response.data && error.response.data.error) {
      console.error('OpenAI API Error:', error.response.data.error);
      res.status(500).json({ error: 'OpenAI API Error', message: error.response.data.error });
    } else {
      res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
