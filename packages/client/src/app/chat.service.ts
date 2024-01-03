import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Character } from '../../../shared/model/character';
import { BuddyMessage } from '../../../shared/model/buddy-message';
import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private http: HttpClient, private environmentService: EnvironmentService) {}

  async ping() {
    try {
      const response = await firstValueFrom(this.http.get<{ message: string }>(`${this.environmentService.getSelectedProviderUrl()}/ping`));
      return response;
    } catch (error) {
      throw new Error('Failed to send message to the API');
    }
  }

  async sendMessageToApi(message: string, conversationId?: string, buddy?: Character): Promise<BuddyMessage> {
      const payload = { message, conversationId, buddy };
      const payloadString = JSON.stringify(payload);
      const response = await firstValueFrom(this.http.post<{ conversationId: string, message: string, screenName: string }>(`${this.environmentService.getSelectedProviderUrl()}/chat`, payloadString));
      return response;
  }
  
  // TODO Break out to standalone character service
  async getRandomCharacters(count: number): Promise<Character[]> {
    const response = await firstValueFrom(this.http.get<Character[]>(`${this.environmentService.getSelectedProviderUrl()}/character/random/${count}`));
    return response;
  }

  async getCharacter(searchQuery: string) {
    const payload = { searchQuery };
    const payloadString = JSON.stringify(payload);
    const response = await firstValueFrom(this.http.post<Character>(`${this.environmentService.getSelectedProviderUrl()}/character`, payloadString));
    return response;
  }
}
