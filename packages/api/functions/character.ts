import { api } from '@nitric/sdk';
import { CharacterService } from '../services/character.service';
import { CorsService } from '../services/cors.service';

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
