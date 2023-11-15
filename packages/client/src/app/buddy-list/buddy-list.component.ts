import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ChatService } from '../chat.service';
import { Character } from '../../../../shared/model/character';
import { WindowsService } from '../windows.service';

@Component({
  selector: 'app-buddy-list',
  templateUrl: './buddy-list.component.html',
  styleUrls: ['./buddy-list.component.scss']
})
export class BuddyListComponent implements OnInit {
  buddies!: Character[];
  selectedTab: 'online' | 'search' = 'online';

  constructor(private characterService: ChatService, private windowService: WindowsService) { }

  async ngOnInit(): Promise<void> {
    this.getRandomBuddies();
  }

  async getRandomBuddies(): Promise<void> {
    this.buddies = await this.characterService.getRandomCharacters(10);
  }

  handleOnlineTabClick() {
    this.selectedTab = 'online';
  }

  handleSearchTabClick() {
    this.selectedTab = 'search';
  }

  isTabSelected(tab: 'online' | 'search') {
    return tab === this.selectedTab;
  }

  startChat(buddy: Character): void {
    this.windowService.startChat(buddy);
  }
}
