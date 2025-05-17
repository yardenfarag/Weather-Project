import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MusicState } from '../../store/music/music.state';
import { YouTubeVideo } from '../../services/youtube.service';
import * as MusicActions from '../../store/music/music.actions';

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="playlist-container">
      <h2>Current Playlist</h2>
      <div class="playlist" *ngIf="playlist$ | async as playlist">
        <div 
          *ngFor="let video of playlist" 
          class="playlist-item"
          [class.active]="(currentVideo$ | async)?.id === video.id"
          (click)="playVideo(video)"
        >
          <img [src]="video.thumbnailUrl" [alt]="video.title" class="thumbnail">
          <div class="video-info">
            <h3>{{ video.title }}</h3>
            <p>{{ video.channelTitle }}</p>
            <p>{{ video.duration }} • {{ video.viewCount }} views</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .playlist-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    h2 {
      font-size: 1.25rem;
      font-weight: 500;
      color: var(--text-primary);
      margin: 0;
    }

    .playlist {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      overflow-y: auto;
      max-height: calc(100vh - 300px);
    }

    .playlist-item {
      display: flex;
      gap: 0.75rem;
      padding: 0.75rem;
      border-radius: 8px;
      background: var(--surface-color);
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: var(--surface-hover);
        transform: translateX(4px);
      }

      &.active {
        background: var(--primary-light);
        color: var(--on-primary);
      }
    }

    .thumbnail {
      width: 120px;
      height: 68px;
      object-fit: cover;
      border-radius: 4px;
    }

    .video-info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .video-info h3 {
      margin: 0;
      font-size: 0.9rem;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .video-info p {
      margin: 0;
      font-size: 0.8rem;
      color: var(--text-secondary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .active .video-info p {
      color: var(--on-primary);
    }

    @media (max-width: 768px) {
      .playlist {
        max-height: none;
      }

      .playlist-item {
        flex-direction: column;
      }

      .thumbnail {
        width: 100%;
        height: auto;
        aspect-ratio: 16/9;
      }
    }
  `]
})
export class PlaylistComponent {
  playlist$: Observable<YouTubeVideo[]>;
  currentVideo$: Observable<YouTubeVideo | null>;

  constructor(private store: Store<{ music: MusicState }>) {
    this.playlist$ = this.store.select(state => state.music.playlist);
    this.currentVideo$ = this.store.select(state => state.music.currentVideo);
  }

  playVideo(video: YouTubeVideo) {
    this.store.dispatch(MusicActions.setCurrentVideo({ video }));
    this.store.dispatch(MusicActions.playVideo());
  }
} 