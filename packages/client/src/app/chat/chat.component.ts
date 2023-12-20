import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { take } from 'rxjs';
import { Character } from '../../../../shared/model/character';
import { AudioService } from '../audio.service';
import { ChatService } from '../chat.service';

interface ChatMessage {
  author: 'assistant' | 'user',
  screenName?: string,
  body: string,
  timestamp: Date,
  isAway?: boolean
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chatHistory') chatHistory!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef;

  userMessage = '';
  messages: ChatMessage[] = [];
  conversationId?: string;
  buddy?: Character;

  constructor(
    private chatService: ChatService,
    private renderer: Renderer2,
    private zone: NgZone,
    private audioService: AudioService
  ) {}

  ngOnInit(): void {
    this.audioService.doorOpen();
    setTimeout(() => {
      console.log(`ngOnInit`, this.buddy)
    }, 0);
    
  }

  ngOnDestroy(): void {
    this.audioService.doorSlam();
  }

  ngAfterViewInit() {
    // Set focus on the element with class "message-input"
    if (this.messageInput) {
      this.renderer.selectRootElement(this.messageInput.nativeElement).focus();
    }
  }

  private buildAssistantMessage(message: string, screenName?: string, isAway?: boolean) {
    return { author: 'assistant', screenName, body: message, timestamp: new Date(), isAway } as ChatMessage;
  }

  private buildUserMessage(message: string) {
    return {author: 'user', body: message, timestamp: new Date()} as ChatMessage;
  }

  async sendMessage() {
    if (this.userMessage) {
      this.messages.push(this.buildUserMessage(this.userMessage));
      this.audioService.send();
      this.scrollToBottom();

      try {
        const userMessage: string = this.userMessage;
        this.userMessage = '';
        const response = await this.chatService.sendMessageToApi(userMessage, this.conversationId, this.buddy);
        if (response) {
          this.conversationId = response.conversationId;
          this.messages.push(this.buildAssistantMessage(response.message, response.screenName));
        }
      } catch (error) {
        if (error instanceof HttpErrorResponse && error.status === 503) {
          this.messages.push(this.buildAssistantMessage(error.error.message || this.buddy?.awayMessage, error.error.screenName || this.buddy?.screenName, true));
        } else {
          console.error('API error occurred on sendMessage:', error);
          this.messages.push(this.buildAssistantMessage(`Oops! Something went wrong. Sorry about that!`, 'Buddy'));
        }
      } finally {
        this.audioService.receive();
        // Wait for the view to update and then scroll to the bottom
        this.zone.onStable.pipe(take(1)).subscribe(() => {
          this.scrollToBottom();
        });
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

  scrollToBottom() {
    try {
      // Get the native element of the content container
      const container = this.chatHistory.nativeElement;

      // Scroll to the bottom
      container.scrollTop = container.scrollHeight;
    } catch (err) {
      console.error('Error while scrolling to bottom:', err);
    }
  }
}
