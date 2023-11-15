import { AfterViewInit, Component, QueryList, ViewChildren, ViewContainerRef } from '@angular/core';
import { ChatComponent } from './chat/chat.component';
import { MenuItem } from './menu.item';
import { WindowsService } from './windows.service';
import { BuddyListComponent } from './buddy-list/buddy-list.component';
import { Character } from '../../../shared/model/character';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  menu: MenuItem[] = [
    {
      name: '😆 LOL Instant Messenger',
      goTo: BuddyListComponent,
    },
    {
      name: '💬 LOL IM Chat',
      goTo: ChatComponent,
    },
    {
      name: '🔗 Github',
      goTo: 'https://github.com/joshknopp/lol-instant-messenger',
    }
  ];

  date = new Date();
  startMenuOpened = false;
  lastZIndex = 10;
  lastWindowOpened = 0;
  openedWindows = [
    {
      component: BuddyListComponent,
      zIndex: this.lastZIndex,
      title: '😆 LOL Instant Messenger'
    }
  ];

  @ViewChildren('dynamic', {read: ViewContainerRef})
  public windowTargets!: QueryList<ViewContainerRef>;

  constructor(
    private readonly windowsService: WindowsService
  ) {}

  ngAfterViewInit(): void {
    this.loadWindowContentWithDelay(0, this.openedWindows[0].component);
    this.windowsService.openedEvent
      .subscribe((data: MenuItem) => {
        this.openMenuItem(data);
      });
    this.windowsService.startedChatEvent
      .subscribe((buddy: Character) => {
        this.openMenuItem( {
          name: '💬 LOL IM Chat',
          goTo: ChatComponent,
          payload: buddy
        });
      });
  }

  openMenuItem(item: MenuItem): void {
    if (typeof item.goTo === 'string') {
      window.open(item.goTo, '_blank');
      return;
    }
    this.openComponent(item.goTo, item.name, item.payload);
    this.startMenuOpened = false;
  }

  openComponent(component: any, title: string, payload?: any): void {
    this.openedWindows = [...this.openedWindows, {
      component,
      zIndex: this.lastZIndex + 1,
      title
    }];
    this.lastZIndex += 1;
    this.lastWindowOpened = this.openedWindows.length - 1;
    this.loadWindowContentWithDelay(this.openedWindows.length - 1, component, payload);
  }

  closeWindow(index: number): void {
    this.openedWindows.splice(index, 1);
  }

  focusWindow(index: number): void {
    this.openedWindows[index].zIndex = this.lastZIndex + 1;
    this.lastZIndex += 1;
    this.lastWindowOpened = index;
  }

  private loadWindowContentWithDelay(index: number, component: any, payload?: any): void {
    setTimeout(() => {
      this.loadWindowContent(index, component, payload);
    }, 20);
  }

  private loadWindowContent(index: number, component: any, payload?: any): void {
    const target = this.windowTargets.toArray()[index];
    const ref = target.createComponent(component);
    ref.changeDetectorRef.detectChanges();

    // Set screen name if we are trying to chat, and we have a name in mind
    if (component === ChatComponent) {
      (ref.instance as ChatComponent).buddy = payload;
    }
    
    this.focusWindow(index);

    // TODO Need to handle positioning - maybe containerElement's first child?
    let containerElement = ref.location.nativeElement.parentElement;
    while (containerElement && !containerElement.classList.contains('window-element')) {
      containerElement = containerElement.parentElement;
    }

    if (containerElement) {
      containerElement.style.position = 'absolute';
      containerElement.style.left = '10px';
      containerElement.style.top = '10px';
    }
  }
}
