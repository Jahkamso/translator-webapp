import express from "express";
import OpenAI from "openai";
import cors from "cors";

const app = express();
const port = process.env.PORT;
console.log(port);

const openai = new OpenAI({
  apiKey: `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`,
});

app.use(express.json());

// Enable CORS for all routes
app.use(cors());

app.get('/test', (req, res) => {
  res.send('Hello from test')
})

app.post(`/api/translate`, async (req, res) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: req.body.messages,
      temperature: 0.7,
      max_tokens: 64,
      top_p: 1,
    });

    res.json({ response: response.choices[0].message.content });
    // console.log(response.choices[0].message.content)
  } catch (error) {
    console.error(error);

    if (error.response && error.response.data && error.response.data.error) {
      console.error("OpenAI API Error:", error.response.data.error);
      res.status(500).json({
        error: "OpenAI API Error",
        message: error.response.data.error,
      });
    } else {
      res
        .status(500)
        .json({ error: "Internal Server Error", message: error.message });
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
