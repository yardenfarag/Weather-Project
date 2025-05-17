import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { MusicState } from '../../store/music/music.state';
import * as MusicActions from '../../store/music/music.actions';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-mood-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mood-selector">
      <h2>Select Mood</h2>
      <div class="moods-container">
        <button 
          *ngFor="let mood of moods" 
          (click)="selectMood(mood)"
          [class.active]="(selectedMood$ | async) === mood"
          class="mood-button">
          <i class="material-icons">{{ getMoodIcon(mood) }}</i>
          <span>{{ mood }}</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .mood-selector {
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 1rem;
    }

    h2 {
      margin: 0 0 1rem 0;
      font-size: 1.2rem;
      font-weight: 500;
      color: var(--text-primary);
    }

    .moods-container {
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding-right: 0.5rem;
    }

    .moods-container::-webkit-scrollbar {
      width: 6px;
    }

    .moods-container::-webkit-scrollbar-track {
      background: var(--surface-hover);
      border-radius: 3px;
    }

    .moods-container::-webkit-scrollbar-thumb {
      background: var(--primary-color);
      border-radius: 3px;
    }

    .mood-button {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border: none;
      border-radius: 8px;
      background: var(--surface-color);
      color: var(--text-primary);
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: left;
      width: 100%;
    }

    .mood-button:hover {
      background: var(--surface-hover);
      transform: translateX(4px);
    }

    .mood-button.active {
      background: var(--primary-color);
      color: white;
    }

    .mood-button i {
      font-size: 1.5rem;
    }

    .mood-button span {
      font-size: 1rem;
      text-transform: capitalize;
    }
  `]
})
export class MoodSelectorComponent {
  moods = ['happy', 'sad', 'energetic', 'relaxed', 'angry', 'nostalgic'];
  selectedMood$: Observable<string | null>;

  constructor(private store: Store<{ music: MusicState }>) {
    this.selectedMood$ = this.store.select(state => state.music.selectedMood);
  }

  selectMood(mood: string) {
    console.log('Selecting mood:', mood);
    // First set the mood
    this.store.dispatch(MusicActions.setMood({ mood }));
    // Then load the videos for that mood
    this.store.dispatch(MusicActions.loadMoodVideos({ mood }));
  }

  getMoodIcon(mood: string): string {
    const icons: { [key: string]: string } = {
      happy: 'sentiment_very_satisfied',
      sad: 'sentiment_very_dissatisfied',
      energetic: 'bolt',
      relaxed: 'spa',
      angry: 'mood_bad',
      nostalgic: 'history'
    };
    return icons[mood] || 'music_note';
  }
} 