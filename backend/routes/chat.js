const express = require('express');
const OpenAI = require('openai');

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your-openai-api-key-here', // Replace with your actual API key or set environment variable
});

router.post('/message', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a highly intelligent and professional AI assistant, similar to ChatGPT. Provide helpful, accurate, and engaging responses to user queries.' },
        { role: 'user', content: message }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const botResponse = completion.choices[0].message.content.trim();
    res.json({ response: botResponse });
  } catch (error) {
    console.error('Error with OpenAI API:', error);
    res.status(500).json({ error: 'I apologize, but I\'m experiencing technical difficulties. Please try again later.' });
  }
});

module.exports = router;
