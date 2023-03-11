const venom = require('venom-bot');
const openai = require('openai-node');
const prompt = 'Please input some text.';
const engine = 'davinci';
const completions = 1;
const openai_key = '<your_openai_key_here>';

const openai_client = new openai(openai_key);

venom.create().then((client) => start(client));

function start(client) {
  client.onMessage(async (message) => {
    if (message.body.toLowerCase().startsWith('/chatgpt ')) {
      const userInput = message.body.slice(9);
      const promptText = prompt + '\nUser: ' + userInput + '\nAI:';
      const gptResponse = await generateText(promptText, engine, completions);
      await client.reply(message.from, gptResponse, message.id.toString());
    }
  });
}

async function generateText(prompt, engine, maxTokens) {
  const promptString = prompt.trim();
  const tokenCount = (promptString.split(' ').length) + maxTokens;
  const gptResponse = await openai_client.completions.create({
    engine: engine,
    prompt: promptString,
    max_tokens: tokenCount,
    n: 1,
    stop: '\n'
  });
  return gptResponse.choices[0].text.trim();
}
