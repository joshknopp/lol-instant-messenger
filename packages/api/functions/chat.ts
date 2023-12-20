import { api, secret } from '@nitric/sdk';
import { v4 as uuidv4 } from 'uuid';
import { Character } from '../../shared/model/character';
import { BuddyMessage } from '../../shared/model/buddy-message';
import { CharacterService } from '../services/character.service';
import { CorsService } from '../services/cors.service';
import { OpenAiService } from '../services/openai.service';

const cors = CorsService.getCorsConfig();
const chatApi = api('lol-im-chat', {
  middleware: [cors],
});

const openAiService: OpenAiService = new OpenAiService();
const characterService: CharacterService = new CharacterService();

const conversations = new Map<string, Conversation>();

interface Conversation {
  character: Character,
  messages: {
    role: string,
    content: string
  }[]
}

async function getCharacterInstruction(character: Character): Promise<string> {
  return `You are ${character.name}, known for ${character.knownFor}, and the user is chatting with you in an IM application similar to AOL Instant Messenger. ` +
    `Your IM screen name is "${character.screenName}" but the user already knows this, you do not need to send it with every message. ` + 
    `Your goal is not to be a helpful assistant, but only to remain in character at all times. ` +
    `Directly and briefly answer questions or respond to statements as the character would. ` +
    `If your character appears in comedy, your responses should be funny. If you are a villain, you should gently antagonize the user. ` +
    `Every response must be completely in character, including occasional use of catch phrases. ` +
    `If you are from a specific era in time, use only language and reference events appropriate to your time period. ` +
    `Use informal messaging slang, and note this is AOL Instant Messenger from the 90s, so no emojis are available. ` +
    `When appropriate, sparingly use simple glyphs like :) for a smile or :( for a frown. `;
}

function generateConversationId(): string {
  return uuidv4();
}

chatApi.get('/health', async (ctx) => {
  ctx.res.status = 200;
  ctx.res.body = 'ack';
});

chatApi.post('/chat', async (ctx) => {
  const input: Record<string, any> = ctx.req.json();
  const userMessage: string = input.message;
  let conversationId: string = input.conversationId;
  let buddy: Character = input.buddy;

  if (!conversationId) {
    conversationId = generateConversationId();
    let character: Character = buddy || await characterService.getCharacter();
    let characterInstruction = await getCharacterInstruction(character);
    // Initialize the conversation history with a system message
    conversations.set(conversationId, { character, messages: [{ role: 'system', content: characterInstruction }] });
  }

  let conversation: Conversation = conversations.get(conversationId);
  let conversationHistory = conversation?.messages || [];
  conversationHistory.push({ role: 'user', content: userMessage });

  let buddyMessage: BuddyMessage = { conversationId, screenName: conversation?.character?.screenName } as BuddyMessage;
  let status: number = 200;

  try {
    const openAIResponse: string = await openAiService.sendRequestToOpenAI(conversationHistory);
    conversationHistory.push({ role: 'assistant', content: openAIResponse });
    // TODO How to handle service restarts? Convo will be gone from memory; currently returns 503, but only AFTER hitting OpenAI
  conversations.get(conversationId).messages = conversationHistory;
    buddyMessage.message = openAIResponse;
  } catch(err: any) {
    buddyMessage.message = conversation?.character?.awayMessage;
    buddyMessage.isAway = true;
    console.error(err);
    status = 503;
  }

  // TODO if an error causes away message to return, probably should not be status 200
  ctx.res.status = status;
  ctx.res.json(buddyMessage);
});

chatApi.post('/character', async (ctx) => {
  const input: Record<string, any> = ctx.req.json();
  const searchQuery: string = input.searchQuery;
  
  try {
    const result = await characterService.getCharacter(searchQuery);
    ctx.res.status = 200;
    ctx.res.json(result);
  } catch(err: any) {
    ctx.res.status = 503;
    ctx.res.json(err);
  }
});

chatApi.get('/character/random/:count', async (ctx) => {
  const count = parseInt(ctx.req.params['count']);
  
  try {
    const result: Character[] = await characterService.getRandomExampleCharacters(count);
    ctx.res.status = 200;
    ctx.res.json(result);
  } catch(err: any) {
    ctx.res.status = 503;
    ctx.res.json(null);
  }
});

const apiKeyWritable = secret('api-key').for('put');

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
