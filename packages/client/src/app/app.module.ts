import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import { DraggableDirective } from './draggable.directive';
import { WindowsService } from './windows.service';

@NgModule({
  declarations: [
    AppComponent, 
    DraggableDirective,
    ChatComponent],
  imports: [BrowserModule, FormsModule, HttpClientModule],
  providers: [
    WindowsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
