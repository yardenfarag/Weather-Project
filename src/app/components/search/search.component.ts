import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MusicState } from '../../store/music/music.state';
import * as MusicActions from '../../store/music/music.actions';
import { YouTubeVideo } from '../../services/youtube.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-container">
      <div class="search-bar">
        <input 
          type="text" 
          [(ngModel)]="searchQuery" 
          (keyup.enter)="search()"
          placeholder="Search for music..."
        >
        <button (click)="search()">Search</button>
      </div>

      <div class="results" *ngIf="(searchResults$ | async)?.length">
        <div 
          *ngFor="let video of searchResults$ | async" 
          class="video-item"
          (click)="playVideo(video)"
        >
          <img [src]="video.thumbnailUrl" [alt]="video.title">
          <div class="video-info">
            <h3>{{ video.title }}</h3>
            <p>{{ video.channelTitle }}</p>
            <p>{{ video.duration }} • {{ video.viewCount }} views</p>
          </div>
        </div>
      </div>

      <div class="no-results" *ngIf="(searchResults$ | async)?.length === 0">
        <p>No results found. Try searching for something else.</p>
      </div>
    </div>
  `,
  styles: [`
    .search-container {
      padding: 1rem;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      overflow-y: auto;
    }

    .search-bar {
      display: flex;
      gap: 0.5rem;
    }

    input {
      flex: 1;
      padding: 0.75rem;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      background: var(--surface-color);
      color: var(--text-primary);
      font-size: 1rem;
    }

    input:focus {
      outline: none;
      border-color: var(--primary-color);
    }

    button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      background: var(--primary-color);
      color: white;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.2s;
    }

    button:hover {
      background: var(--primary-color-dark);
    }

    .results {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .video-item {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      border-radius: 8px;
      background: var(--surface-color);
      cursor: pointer;
      transition: transform 0.2s, background-color 0.2s;
    }

    .video-item:hover {
      transform: translateX(4px);
      background: var(--surface-hover);
    }

    .video-item img {
      width: 120px;
      height: 90px;
      object-fit: cover;
      border-radius: 4px;
    }

    .video-info {
      flex: 1;
    }

    .video-info h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.1rem;
      color: var(--text-primary);
    }

    .video-info p {
      margin: 0.25rem 0;
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .no-results {
      text-align: center;
      color: var(--text-secondary);
      padding: 2rem;
    }
  `]
})
export class SearchComponent {
  searchQuery = '';
  searchResults$: Observable<YouTubeVideo[]>;

  constructor(private store: Store<{ music: MusicState }>) {
    this.searchResults$ = this.store.select(state => state.music.searchResults);
  }

  search() {
    if (this.searchQuery.trim()) {
      this.store.dispatch(MusicActions.searchVideos({ query: this.searchQuery }));
    }
  }

  playVideo(video: YouTubeVideo) {
    console.log('Playing video:', video);
    // First set the current video
    this.store.dispatch(MusicActions.setCurrentVideo({ video }));
    // Then play it
    this.store.dispatch(MusicActions.playVideo());
  }
} 