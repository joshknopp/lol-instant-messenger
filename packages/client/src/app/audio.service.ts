import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audio: HTMLAudioElement;

  constructor() {
    this.audio = new Audio();
  }

  doorOpen() {
    this.playAudio('dooropen.wav');
  }

  doorSlam() {
    this.playAudio('doorslam.wav');
  }

  receive() {
    this.playAudio('imrcv.wav');
  }

  send() {
    this.playAudio('imsend.wav');
  }

  playAudio(filename: string): void {
    this.audio.src = `assets/audio/${filename}`;
    this.audio.load();
    this.audio.play();
  }
}
