import { Injectable, EventEmitter, Output } from '@angular/core';
import { MenuItem } from './menu.item';

@Injectable()
export class WindowsService {
    @Output() openedEvent = new EventEmitter<MenuItem>();

    openMenuItem(item: MenuItem): void {
        setTimeout(() => {
            this.openedEvent.emit(item);
        }, 10);
    }
}
