import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, interval, take, takeUntil, timeout } from 'rxjs';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss']
})
export class ClockComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  currentTime: Date = new Date();

  constructor() { }

  ngOnInit(): void {
    this.setupClock();
  }

  private setupClock(): void {
    const currentTime = new Date();
    const initialDelay = 60 - currentTime.getSeconds();

    // Use timeout for the initial delay
    interval(initialDelay * 1000)
      .pipe(
        take(1),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.updateTime();
        interval(60 * 1000)
          .pipe(
            takeUntil(this.destroy$)
          ).subscribe(() => {
            this.updateTime();
          });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateTime(): void {
    this.currentTime = new Date();
  }
}
