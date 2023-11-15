import { Injectable, EventEmitter, Output } from '@angular/core';
import { MenuItem } from './menu.item';
import { Character } from '../../../shared/model/character';

@Injectable()
export class WindowsService {
    @Output() openedEvent = new EventEmitter<MenuItem>();
    @Output() startedChatEvent = new EventEmitter<Character>();

    openMenuItem(item: MenuItem): void {
        setTimeout(() => {
            this.openedEvent.emit(item);
        }, 10);
    }

    startChat(buddy: Character): void {
        this.startedChatEvent.emit(buddy);
    }
}
