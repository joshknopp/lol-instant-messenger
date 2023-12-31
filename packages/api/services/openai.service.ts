import { secret } from '@nitric/sdk';
import { OpenAI } from 'openai';

export class OpenAiService {
  private apiKeyReadable = secret('api-key').for('access');

  // TODO Add caching to avoid repeatedly calling secret store
  private async getApiKey(): Promise<string> {
    const latest = await this.apiKeyReadable.latest().access();
    return latest.asString();
  }

  private async getClient(): Promise<OpenAI> {
    const apiKey = await this.getApiKey();
    return new OpenAI({ apiKey });
  }
  
  // TODO error handling no good, test by setting invalid API key
  async sendRequestToOpenAI(conversation): Promise<string> {
    const openai: OpenAI = await this.getClient();
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 1,
      messages: conversation,
    });
    return chatCompletion.choices[0].message.content;
  }

}
