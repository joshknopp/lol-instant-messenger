import { OpenAiService } from './openai.service';

const openAiService: OpenAiService = new OpenAiService();

export interface Character {
  name: string,
  knownFor: string,
  screenName: string,
  awayMessage: string
}

function getSystemQuery() {
    return `You are a chatbot personality assistant. You will be prompted for data that will help 
    other OpenAI instances to emulate the speech patterns, catch phrases, and other idiosyncracies 
    of well-known celebrities and fictional characters for entertainment purposes.`;
}

// TODO Ask OpenAI to craft a prompt to serve as the "system" prompt for the actual chat for this character
async function getCharacterData(searchQuery: string): Promise<string> {
    if (!searchQuery) {
      searchQuery = 'a totally random TV, movie, music, or pop culture personality from early 90s';
    }
    return `Give me one celebrity or fictional character that matches this search query:
      "${searchQuery}". Provide a string knownFor which states the TV show or other media they are famous for. 
      The screenName property is a clever or funny screen name between 3 and 16 characters that matches the 
      person's identity. The awayMessage should be a clever pun or joke, or a song lyric. Don't be boring!
      Response format should be a Json object containing keys: { name, knownFor, screenName, awayMessage } 
      Values are all strings and all are required. Double check that all keys are defined.
      Respond with Json object only, no other text or commentary.`;
}
  
export class CharacterService {
    async getCharacter(searchQuery: string = null): Promise<Character> {
        const openAIResponse: string = await openAiService.sendRequestToOpenAI([
            { role: 'system', content: getSystemQuery() },
            { role: 'user', content: await getCharacterData(searchQuery) }
        ]);
        const result = JSON.parse(openAIResponse);
        return result;
    }

    getRandomStaticCharacter(): Character {
        const characters: Character[] = [
            {
                name: 'Michael Jackson',
                knownFor: 'King of Pop',
                screenName: 'Moonwalker88',
                awayMessage: "Just moonwalking through life!"
            },
            {
                name: 'Indiana Jones',
                knownFor: 'Indiana Jones films',
                screenName: 'WhipMaster1899',
                awayMessage: "Exploring ancient artifacts today."
            },
            {
                name: 'Eddie Murphy',
                knownFor: 'Axel Foley in "Beverly Hills Cop"',
                screenName: 'LaughMaster',
                awayMessage: "Having a good laugh elsewhere."
            },
            {
                name: 'Marty McFly',
                knownFor: 'Back to the Future',
                screenName: 'MartyMcFly68',
                awayMessage: "Time-traveling, be back soon!"
            },
            {
                name: 'Elvis Presley',
                knownFor: 'The King of Rock and Roll',
                screenName: 'RockNRollKing',
                awayMessage: "Rocking in the afterlife."
            },
            {
                name: 'Rambo',
                knownFor: 'John Rambo',
                screenName: 'ActionHero77',
                awayMessage: "Defending freedom, out of town."
            },
            {
                name: 'Ellen Ripley',
                knownFor: 'Alien series',
                screenName: 'XenomorphHunter',
                awayMessage: "Battling Xenomorphs, don't disturb."
            },
            {
                name: 'The Terminator',
                knownFor: 'Arnold Schwarzenegger',
                screenName: 'AssassinT800',
                awayMessage: "I'll be back, offline for now."
            },
            {
                name: 'Madonna',
                knownFor: 'Queen of Pop',
                screenName: 'MaterialGirl',
                awayMessage: "Striking a pose somewhere."
            },
            {
                name: 'Morpheus',
                knownFor: 'The Matrix',
                screenName: 'RedPillLeader',
                awayMessage: "Taking the red pill, in the Matrix."
            },
            {
                name: 'Kevin McCallister',
                knownFor: 'Home Alone',
                screenName: 'KidHero92',
                awayMessage: "Defending my home, parents away."
            },
            {
                name: 'Mr. T',
                knownFor: 'B.A. Baracus in "The A-Team"',
                screenName: 'PityTheFool',
                awayMessage: "Pitying the fools elsewhere."
            },
            {
                name: 'James Bond',
                knownFor: '007 spy series',
                screenName: 'SecretAgent007',
                awayMessage: "On a secret mission, back soon."
            },
            {
                name: 'Egon Spengler',
                knownFor: 'Ghostbusters',
                screenName: 'Ghostbuster88',
                awayMessage: "Busting ghosts, will return later."
            },
            {
                name: 'Bill S. Preston Esquire',
                knownFor: 'Bill & Ted films',
                screenName: 'TimeTravelBill',
                awayMessage: "Time-traveling adventures!"
            },
            {
                name: 'Cindy Crawford',
                knownFor: 'Supermodel',
                screenName: 'RunwayQueen',
                awayMessage: "Strutting down the runway."
            },
            {
                name: 'The Fresh Prince',
                knownFor: 'Will Smith',
                screenName: 'BelAirPrince',
                awayMessage: "Chillin' out, maxin', relaxin' all cool."
            },
            {
                name: 'Ace Ventura',
                knownFor: 'Ace Ventura: Pet Detective movie',
                screenName: 'PetDetective',
                awayMessage: "Looking for lost pets, be back soon."
            },
            {
                name: 'Scrooge McDuck',
                knownFor: 'DuckTales',
                screenName: 'RichDuck47',
                awayMessage: "Swimming in my money vault."
            },
            {
                name: 'Lara Croft',
                knownFor: 'Tomb Raider',
                screenName: 'TombExplorer',
                awayMessage: "Exploring ancient tombs, offline."
            }
        ];
    
        return characters[Math.floor(Math.random() * characters.length)];
    }
    

}