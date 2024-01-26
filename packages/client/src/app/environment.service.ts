import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  selectProvider?: { name: string; url: string; };

  getProviders() {
    return [
      { name: 'AWS', url: environment.awsApiUrl },
      { name: 'Azure', url: environment.azureApiUrl },
      { name: 'GCP', url: environment.gcpApiUrl },
    ];
  }

  private getSelectedProvider(): { name: string; url: string; } {
    return this.selectProvider ?? this.getProviders()[0];
  }

  getSelectedProviderUrl(): string {
    return this.getSelectedProvider().url;
  }

  getSelectedProviderName(): string {
    return this.getSelectedProvider().name;
  }

  setSelectedProvider(name: string): void {
    this.selectProvider = this.getProviders().find(i => i.name === name);
  }
}
