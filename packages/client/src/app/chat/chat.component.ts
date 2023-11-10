import { Component } from '@angular/core';
import { ChatService } from '../chat.service';

interface ChatMessage {
  author: 'assistant' | 'user',
  screenName?: string,
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

  private buildAssistantMessage(message: string, screenName?: string) {
    return { author: 'assistant', screenName, body: message, timestamp: new Date() } as ChatMessage;
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
          console.log(response)
          this.conversationId = response.conversationId;
          this.messages.push(this.buildAssistantMessage(response.message, response.screenName));
        }
      } catch (error) {
        console.error('API error occurred on sendMessage:', error);
        this.messages.push(this.buildAssistantMessage(`Oops! Something went wrong. Sorry about that!`, 'Buddy'));
      }
    }
  }

  getUserName(message: ChatMessage): string {
    let result = message.screenName;
    if(!result) {
      result = message.author === 'user' ? 'You' : 'Them';
    }
    return result;
  }
}
