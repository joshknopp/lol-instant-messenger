import { api, secret } from '@nitric/sdk';
import { OpenAI } from 'openai';
import { v4 as uuidv4 } from 'uuid';

const chatApi = api('main');
const apiKeyWritable = secret('api-key').for('put');
const apiKeyReadable = secret('api-key').for('access');

const conversations = new Map<string, any>();

async function getRandomCharacterName(): Promise<string> {
  const characters: string[] = [
    "Steve Urkel",
    "Bart Simpson",
    "Vanilla Ice",
    "Chandler Bing",
    "Cosmo Kramer",
    "Uncle Joey Gladstone"
  ];
  return characters[Math.floor(Math.random() * characters.length)];
}

async function getCharacterInstruction(characterName?: string): Promise<string> {
  // TODO This will eventually be generated by OpenAI, and possibly cached in a data store for repeats
  if (!characterName) {
    characterName = await getRandomCharacterName();
  }
  return `You are ${characterName}. Every response is in character, including occasional use of catch phrases.`;
}

async function getApiKey(): Promise<string> {
  const latest = await apiKeyReadable.latest().access();
  return latest.asString();
}

async function getClient(): Promise<OpenAI> {
  const apiKey = await getApiKey();
  return new OpenAI({ apiKey });
}

function generateConversationId(): string {
  return uuidv4();
}

async function sendRequestToOpenAI(conversation): Promise<string> {
  const openai: OpenAI = await getClient();
  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: conversation,
  });
  return chatCompletion.choices[0].message.content;
}

chatApi.post('/chat', async (ctx) => {
  // Trying to overcome CORS for local testing
  // TODO Beef this up for a real deployment
  ctx.res.headers["Access-Control-Allow-Origin"] = ["*"];
  ctx.res.headers['Access-Control-Allow-Methods'] = ["*"];
  ctx.res.headers['Access-Control-Allow-Headers'] = ["*"];

  const input: Record<string, any> = ctx.req.json();
  const userMessage: string = input.message;
  let conversationId: string = input.conversationId;

  if (!conversationId) {
    conversationId = generateConversationId();
    // Initialize the conversation history with a system message
    conversations.set(conversationId, [{ role: 'system', content: await getCharacterInstruction() }]);
  }

  let conversationHistory = conversations.get(conversationId) || [];
  conversationHistory.push({ role: 'user', content: userMessage });

  const openAIResponse = await sendRequestToOpenAI(conversationHistory);

  conversationHistory.push({ role: 'assistant', content: openAIResponse });
  conversations.set(conversationId, conversationHistory);

  ctx.res.status = 200;
  ctx.res.json({ conversationId, message: openAIResponse });
});

chatApi.put('/apikey', async (ctx) => {
  try {
    const queryValue: string[] = ctx.req.query.value;
    const value: string = Array.isArray(queryValue) ? queryValue[0] : queryValue;
    const latestVersion = await apiKeyWritable.put(value);

    ctx.res.status = 200;
    ctx.res.headers['Content-Type'] = ['application/json'];
    ctx.res.body = JSON.stringify({ version: latestVersion.version });

  } catch (error) {
    ctx.res.status = 500;
    ctx.res.headers['Content-Type'] = ['text/plain'];
    ctx.res.body = 'Server error';
  }
  return ctx;
});
