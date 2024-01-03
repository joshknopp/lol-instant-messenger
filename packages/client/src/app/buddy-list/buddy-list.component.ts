import { Component, OnInit } from '@angular/core';
import { Character } from '../../../../shared/model/character';
import { ChatService } from '../chat.service';
import { WindowsService } from '../windows.service';
import { EnvironmentService } from '../environment.service';

@Component({
  selector: 'app-buddy-list',
  templateUrl: './buddy-list.component.html',
  styleUrls: ['./buddy-list.component.scss']
})
export class BuddyListComponent implements OnInit {
  buddies!: Character[];
  selectedTab: 'online' | 'search' | 'settings' = 'online';
  searchResult?: Character;
  searchQuery!: string;
  providers?: { name: string, url: string }[];
  selectedProviderName?: string;

  constructor(private characterService: ChatService, private windowService: WindowsService, private environmentService: EnvironmentService) { }

  async ngOnInit(): Promise<void> {
    this.getRandomBuddies();
    this.providers = this.environmentService.getProviders();
    this.selectedProviderName = this.environmentService.getSelectedProviderName();
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

  handleSettingsTabClick() {
    this.selectedTab = 'settings';
  }

  isTabSelected(tab: 'online' | 'search' | 'settings') {
    return tab === this.selectedTab;
  }

  startChat(buddy: Character | undefined): void {
    if(buddy) this.windowService.startChat(buddy);
  }

  async searchForBuddy(searchQuery: string) {
    console.log(searchQuery)
    if(searchQuery) {
      this.searchResult = (await this.characterService.getCharacter(searchQuery));
      console.log(this.searchResult)
    }
  }
  
  handleProviderChange(providerName: string) {
    this.environmentService.setSelectedProvider(providerName);
    this.selectedProviderName = providerName;
  }
}
