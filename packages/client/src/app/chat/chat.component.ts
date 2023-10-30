import { Component } from '@angular/core';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  userMessage = '';
  messages: any[] = [];

  constructor(private chatService: ChatService) {}

  async sendMessage() {
    if (this.userMessage) {
      this.messages.push({ userMessage: this.userMessage, assistantMessage: '' });

      try {
        const response = await this.chatService.sendMessageToApi(this.userMessage);
        this.userMessage = '';
        if (response) {
          this.messages[this.messages.length - 1].assistantMessage = response.message;
        }
      } catch (error) {
        console.error('API error:', error);
      }
    }
  }
}
