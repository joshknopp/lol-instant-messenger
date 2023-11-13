import { api } from '@nitric/sdk';
import { v4 as uuidv4 } from 'uuid';
import { CorsService } from '../services/cors.service';
import { OpenAiService } from '../services/openai.service';
import { CharacterService } from '../services/character.service';

const openAiService: OpenAiService = new OpenAiService();
const characterService: CharacterService = new CharacterService();

const cors = CorsService.getCorsConfig();
const chatApi = api('lol-im-character', {
  middleware: [cors],
});

chatApi.post('/character', async (ctx) => {
  const input: Record<string, any> = ctx.req.json();
  const searchQuery: string = input.searchQuery;
  
  try {
    const result = characterService.getCharacter(searchQuery);
    ctx.res.status = 200;
    ctx.res.json(result);
  } catch(err: any) {
    ctx.res.status = 503;
    ctx.res.json(characterService.getRandomStaticCharacter());
  }
});
