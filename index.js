import { Client } from 'whatsapp-web.js';
import openai from '@openai/api';
import axios from 'axios';

const openaiApiKey = 'YOUR_OPENAI_API_KEY';
const openaiModelId = 'YOUR_OPENAI_MODEL_ID';
const sessionClient = new openai.AuthenticatedClient(openaiApiKey);

const client = new Client({
  puppeteer: { 
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu',
    ],
  },
});

client.on('qr', (qr) => {
  console.log('QR code received: ', qr);
});

client.on('ready', () => {
  console.log('Client is ready!');
});

client.on('message', async (message) => {
  if (message.body.startsWith('/chatgpt ')) {
    const messageToGPT = message.body.split('/chatgpt ')[1];
    const gptResponse = await getGPTResponse(messageToGPT);
    message.reply(gptResponse);
  }
});

async function getGPTResponse(prompt) {
  const gptResponse = await sessionClient.completions.create({
    engine: 'davinci',
    prompt: prompt,
    maxTokens: 1024,
    n: 1,
    stop: ['\n'],
    temperature: 0.7,
    frequency_penalty: 0,
    presence_penalty: 0,
    model: openaiModelId,
  });
  return gptResponse.choices[0].text.trim();
}

client.initialize();
