import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { MusicState } from '../../store/music/music.state';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-music-player',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatSliderModule,
    MatProgressBarModule
  ],
  template: `
    <div class="music-player" *ngIf="currentVideo$ | async as video">
      <div class="video-container">
        <video
          #videoPlayer
          [src]="video.videoUrl"
          (timeupdate)="onTimeUpdate($event)"
          (loadedmetadata)="onVideoLoaded($event)"
          (ended)="onVideoEnded()"
          (play)="onPlay()"
          (pause)="onPause()"
        ></video>
      </div>

      <div class="controls">
        <div class="main-controls">
          <button mat-icon-button (click)="togglePlay()">
            <mat-icon>{{ isPlaying ? 'pause' : 'play_arrow' }}</mat-icon>
          </button>
          
          <div class="progress-container">
            <span class="time current">{{ currentTime | date:'mm:ss' }}</span>
            <mat-slider
              class="progress-bar"
              [max]="duration"
              [min]="0"
              [step]="1"
              [discrete]="true"
              (change)="onSeek($event)"
            >
              <input matSliderThumb [value]="currentTime">
            </mat-slider>
            <span class="time total">{{ duration | date:'mm:ss' }}</span>
          </div>

          <div class="volume-control">
            <button mat-icon-button (click)="toggleMute()">
              <mat-icon>{{ isMuted ? 'volume_off' : 'volume_up' }}</mat-icon>
            </button>
            <mat-slider
              class="volume-slider"
              [max]="1"
              [min]="0"
              [step]="0.1"
              [discrete]="true"
              (change)="onVolumeChange($event)"
            >
              <input matSliderThumb [value]="volume">
            </mat-slider>
          </div>
        </div>

        <div class="video-info">
          <h3>{{ video.title }}</h3>
          <p>{{ video.channelTitle }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .music-player {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: var(--surface-color);
      border-top: 1px solid var(--border-color);
      padding: 1rem;
      z-index: 1000;
    }

    .video-container {
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
      background: #000;
      border-radius: 8px;
      overflow: hidden;
      aspect-ratio: 16/9;
    }

    video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .controls {
      margin-top: 1rem;
    }

    .main-controls {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0 1rem;
    }

    .progress-container {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .progress-bar {
      flex: 1;
    }

    .time {
      font-size: 0.8rem;
      color: var(--text-secondary);
      min-width: 45px;
    }

    .volume-control {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .volume-slider {
      width: 100px;
    }

    .video-info {
      margin-top: 0.5rem;
      padding: 0 1rem;
    }

    .video-info h3 {
      margin: 0;
      font-size: 1rem;
      color: var(--text-primary);
    }

    .video-info p {
      margin: 0;
      font-size: 0.9rem;
      color: var(--text-secondary);
    }

    ::ng-deep {
      .mat-slider-track-fill {
        background-color: var(--primary-color) !important;
      }
      
      .mat-slider-thumb {
        background-color: var(--primary-color) !important;
      }
    }
  `]
})
export class MusicPlayerComponent implements OnInit, OnDestroy {
  @ViewChild('videoPlayer', { static: true }) videoPlayer!: ElementRef<HTMLVideoElement>;
  currentVideo$: Observable<any>;
  isPlaying = false;
  isMuted = false;
  currentTime = 0;
  duration = 0;
  volume = 1;
  private subscriptions: Subscription[] = [];

  constructor(private store: Store<{ music: MusicState }>) {
    this.currentVideo$ = this.store.select(state => state.music.currentVideo);
  }

  ngOnInit() {
    this.subscriptions.push(
      this.currentVideo$.subscribe(video => {
        if (video) {
          // Reset player state when video changes
          this.isPlaying = false;
          this.currentTime = 0;
          this.duration = 0;
        }
      })
    );
  }

  ngAfterViewInit() {
    // Set initial volume
    if (this.videoPlayer?.nativeElement) {
      this.videoPlayer.nativeElement.volume = this.volume;
    }
  }

  togglePlay() {
    if (!this.videoPlayer?.nativeElement) return;

    if (this.isPlaying) {
      this.videoPlayer.nativeElement.pause();
    } else {
      this.videoPlayer.nativeElement.play();
    }
  }

  toggleMute() {
    if (!this.videoPlayer?.nativeElement) return;
    this.isMuted = !this.isMuted;
    this.videoPlayer.nativeElement.muted = this.isMuted;
  }

  onTimeUpdate(event: Event) {
    if (!this.videoPlayer?.nativeElement) return;
    this.currentTime = this.videoPlayer.nativeElement.currentTime;
  }

  onVideoLoaded(event: Event) {
    if (!this.videoPlayer?.nativeElement) return;
    this.duration = this.videoPlayer.nativeElement.duration;
  }

  onVideoEnded() {
    this.isPlaying = false;
    this.currentTime = 0;
  }

  onPlay() {
    this.isPlaying = true;
  }

  onPause() {
    this.isPlaying = false;
  }

  onSeek(event: any) {
    if (!this.videoPlayer?.nativeElement) return;
    this.videoPlayer.nativeElement.currentTime = event.value;
  }

  onVolumeChange(event: any) {
    if (!this.videoPlayer?.nativeElement) return;
    this.volume = event.value;
    this.videoPlayer.nativeElement.volume = this.volume;
    this.isMuted = this.volume === 0;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
} 