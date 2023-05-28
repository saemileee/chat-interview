require('dotenv').config();

const OpenAI = require('openai');
const { Configuration, OpenAIApi } = OpenAI;

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3001;

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ORGANIZATION_ID = process.env.ORGANIZATION_ID;

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
  organization: ORGANIZATION_ID,
});
const openai = new OpenAIApi(configuration);

app.use(bodyParser.json());
app.use(cors());

app.post('/', async (req, res) => {
  const { message } = req.body;

  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    max_tokens: 3000,
    messages: [
      {
        role: 'system',
        content: `You are a front-end interviewer and you are interviewing face to face. Please give me a short feedback on my Q&A and speak in Korean with a score of 10.`,
      },
      {
        role: 'user',
        content: message,
      },
    ],
  });

  res.json(response.data.choices[0].message.content);

  // if (response && response.choices && response.choices.length > 0) {
  //   const generatedText = response.choices[0].message.content;
  //   res.json({ message: generatedText });
  // } else {
  //   res.json({ message: 'No response from the API' });
  // }
});

app.listen(port, () => {
  console.log('Example app port: ' + port);
});
