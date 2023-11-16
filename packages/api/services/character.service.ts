import { Character } from '../../shared/model/character';
import { OpenAiService } from './openai.service';
import { exampleCharacters } from '../../shared/data/character-data';

const openAiService: OpenAiService = new OpenAiService();

function getSystemQuery() {
    return `You are a chatbot personality assistant. You will be prompted for data that will help 
    other OpenAI instances to emulate the speech patterns, catch phrases, and other idiosyncracies 
    of well-known celebrities and fictional characters for entertainment purposes.`;
}

export class CharacterService {
    async getCharacter(searchQuery: string = null): Promise<Character> {
        const openAIResponse: string = await openAiService.sendRequestToOpenAI([
            { role: 'system', content: getSystemQuery() },
            { role: 'user', content: await this.getCharacterPrompt(searchQuery) }
        ]);
        const result = JSON.parse(openAIResponse);
        return result;
    }

    getRandomStaticCharacter(): Character {
        return exampleCharacters[Math.floor(Math.random() * exampleCharacters.length)];
    }
    
    getListOfExampleCharacterNames() {
        const names: string[] = exampleCharacters.map(character => character.name);
        names.sort((a,b) => Math.random() - 0.5);
        return names.slice(0, 5).join();
    }
    
    async getRandomExampleCharacters(count: number = 10): Promise<Character[]> {
        const characters: Character[] = [...exampleCharacters];
        characters.sort((a,b) => Math.random() - 0.5);
        return characters.slice(0, count);
    }

    // TODO Ask OpenAI to craft a prompt to serve as the "system" prompt for the actual chat for this character
    async getCharacterPrompt(searchQuery: string): Promise<string> {
        if (!searchQuery) {
            searchQuery = `a random TV, movie, music, or pop culture personality from early 90s; examples include ${this.getListOfExampleCharacterNames()} but do not use these, think of another`;
        }
        return `Give me one celebrity or fictional character that matches this search query:
        "${searchQuery}". Provide a string knownFor which states the TV show or other media they are famous for. 
        The screenName property is a clever or funny screen name between 3 and 16 characters that matches the 
        person's identity. The awayMessage should be a clever pun or joke, or a song lyric. Don't be boring!
        Response format should be a Json object containing keys: { name, knownFor, screenName, awayMessage } 
        Values are all strings and all are required. Double check that all keys are defined.
        Respond with Json object only, no other text or commentary.`;
    }
}
