import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment'; // Import the environment

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private http: HttpClient) {}

  async ping() {
    try {
      const response = await this.http.get<{ message: string }>(`${environment.apiUrl}/ping`).toPromise();
      return response;
    } catch (error) {
      throw new Error('Failed to send message to the API');
    }
  }

  async sendMessageToApi(message: string, conversationId?: string) {
    try {
      const payload = {message, conversationId};
      console.log(`url = ${environment.apiUrl}/chat`);
      console.log(`payload`, payload);
      const response = await this.http.post<{ message: string }>(`${environment.apiUrl}/chat`, payload).toPromise();
      return response;
    } catch (error) {
      throw new Error('Failed to send message to the API');
    }
  }
}
