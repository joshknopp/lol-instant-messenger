import { Component } from '@angular/core';
import { ChatService } from '../chat.service';

interface ChatMessage {
  author: 'assistant' | 'user',
  body: string,
  timestamp: Date
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  userMessage = 'hi! tell me about yourself';
  messages: ChatMessage[] = [];
  conversationId?: string;

  constructor(private chatService: ChatService) {}

  private buildAssistantMessage(message: string) {
    return {author: 'assistant', body: message, timestamp: new Date()} as ChatMessage;
  }

  private buildUserMessage(message: string) {
    return {author: 'user', body: message, timestamp: new Date()} as ChatMessage;
  }

  async sendMessage() {
    if (this.userMessage) {
      this.messages.push(this.buildUserMessage(this.userMessage));

      try {
        const userMessage: string = this.userMessage;
        this.userMessage = '';
        const response = await this.chatService.sendMessageToApi(userMessage, this.conversationId);
        if (response) {
          this.conversationId = response.conversationId;
          this.messages.push(this.buildAssistantMessage(response.message));
        }
      } catch (error) {
        console.error('API error:', error);
      }
    }
  }
}
