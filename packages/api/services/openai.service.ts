import { secret } from '@nitric/sdk';
import { OpenAI } from 'openai';

export class OpenAiService {
  private apiKeyReadable = secret('api-key').for('access');

  private async getApiKey(): Promise<string> {
    const latest = await this.apiKeyReadable.latest().access();
    return latest.asString();
  }

  private async getClient(): Promise<OpenAI> {
    const apiKey = await this.getApiKey();
    return new OpenAI({ apiKey });
  }
  
  async sendRequestToOpenAI(conversation): Promise<string> {
    const openai: OpenAI = await this.getClient();
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: conversation,
    });
    return chatCompletion.choices[0].message.content;
  }

}
  