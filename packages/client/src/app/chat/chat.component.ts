import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  userMessage = 'Tell me about yourself';
  messages: any[] = [];

  constructor(private chatService: ChatService) {}

  async ngOnInit(): Promise<void> {
    //const response = await this.chatService.ping();
    //console.log(`ping`, response);
  }

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
