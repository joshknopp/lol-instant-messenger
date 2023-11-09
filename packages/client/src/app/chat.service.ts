import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private http: HttpClient) {}

  async ping() {
    try {
      const response = await firstValueFrom(this.http.get<{ message: string }>(`${environment.apiUrl}/ping`));
      return response;
    } catch (error) {
      throw new Error('Failed to send message to the API');
    }
  }

  async sendMessageToApi(message: string, conversationId?: string) {
      const payload = {message, conversationId};
      const payloadString = JSON.stringify(payload);
      const response = await firstValueFrom(this.http.post<{ conversationId: string, message: string }>(`${environment.apiUrl}/chat`, payloadString));
      return response;
  }
}
