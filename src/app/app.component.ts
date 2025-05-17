import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MusicState } from './store/music/music.state';
import { ThemeService } from './services/theme.service';
import { MusicPlayerComponent } from './components/music-player/music-player.component';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { SearchComponent } from './components/search/search.component';
import { MoodSelectorComponent } from './components/mood-selector/mood-selector.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import * as MusicActions from './store/music/music.actions';
import { RouterOutlet } from '@angular/router';
import { ThemeSelectorComponent } from './components/theme-selector/theme-selector.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MusicPlayerComponent,
    PlaylistComponent,
    SearchComponent,
    MoodSelectorComponent,
    MatIconModule,
    MatButtonModule,
    ThemeSelectorComponent
  ],
  template: `
    <div class="app-container" [class]="currentTheme">
      <div class="header">
        <div class="logo">
          <h1>MoodTunes</h1>
        </div>
        <app-theme-selector (themeChange)="onThemeChange($event)"></app-theme-selector>
      </div>

      <div class="main-layout">
        <div class="sidebar">
          <app-mood-selector></app-mood-selector>
        </div>
        
        <div class="main-content">
          <app-search></app-search>
          <div class="playlist-section">
            <h2>Current Playlist</h2>
            <app-playlist></app-playlist>
          </div>
        </div>
      </div>
      
      <app-music-player></app-music-player>
    </div>
  `,
  styles: [`
    :root {
      /* Default theme */
      --primary-color: #6200ee;
      --primary-color-dark: #3700b3;
      --surface-color: #ffffff;
      --surface-hover: #f5f5f5;
      --text-primary: #000000;
      --text-secondary: #666666;
      --border-color: #e0e0e0;
      --background-color: #fafafa;
    }

    /* Default theme */
    .theme-default {
      --primary-color: #6200ee;
      --primary-color-dark: #3700b3;
      --surface-color: #ffffff;
      --surface-hover: #f5f5f5;
      --text-primary: #000000;
      --text-secondary: #666666;
      --border-color: #e0e0e0;
      --background-color: #fafafa;
    }

    /* Dark theme */
    .theme-dark {
      --primary-color: #bb86fc;
      --primary-color-dark: #3700b3;
      --surface-color: #1e1e1e;
      --surface-hover: #2d2d2d;
      --text-primary: #ffffff;
      --text-secondary: #b0b0b0;
      --border-color: #333333;
      --background-color: #121212;
    }

    /* Warm theme */
    .theme-warm {
      --primary-color: #ff6b6b;
      --primary-color-dark: #ff4757;
      --surface-color: #fff5f5;
      --surface-hover: #ffe3e3;
      --text-primary: #2d3436;
      --text-secondary: #636e72;
      --border-color: #ffd8d8;
      --background-color: #fff9f9;
    }

    /* Pinky theme */
    .theme-pinky {
      --primary-color: #ff69b4;
      --primary-color-dark: #ff1493;
      --surface-color: #fff0f5;
      --surface-hover: #ffe4e1;
      --text-primary: #4a4a4a;
      --text-secondary: #808080;
      --border-color: #ffc0cb;
      --background-color: #fff5f8;
    }

    /* Nature theme */
    .theme-nature {
      --primary-color: #2ecc71;
      --primary-color-dark: #27ae60;
      --surface-color: #f0fff4;
      --surface-hover: #e6ffed;
      --text-primary: #2c3e50;
      --text-secondary: #7f8c8d;
      --border-color: #c8e6c9;
      --background-color: #f7fff9;
    }

    /* Sunny theme */
    .theme-sunny {
      --primary-color: #f1c40f;
      --primary-color-dark: #f39c12;
      --surface-color: #fffde7;
      --surface-hover: #fff9c4;
      --text-primary: #2c3e50;
      --text-secondary: #7f8c8d;
      --border-color: #ffe082;
      --background-color: #fffef5;
    }

    /* Ocean theme */
    .theme-ocean {
      --primary-color: #3498db;
      --primary-color-dark: #2980b9;
      --surface-color: #e3f2fd;
      --surface-hover: #bbdefb;
      --text-primary: #2c3e50;
      --text-secondary: #7f8c8d;
      --border-color: #90caf9;
      --background-color: #f5f9ff;
    }

    .app-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background-color: var(--background-color);
      color: var(--text-primary);
      transition: all 0.3s ease;
      font-family: 'Roboto', sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background-color: var(--surface-color);
      border-bottom: 1px solid var(--border-color);
      transition: all 0.3s ease;
    }

    .logo h1 {
      margin: 0;
      color: var(--primary-color);
      font-size: 2rem;
      font-weight: 500;
      letter-spacing: -0.5px;
      transition: color 0.3s ease;
    }

    .main-layout {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    .sidebar {
      width: 300px;
      background-color: var(--surface-color);
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      padding: 2rem;
      overflow-y: auto;
      transition: all 0.3s ease;
    }

    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 2rem;
      overflow-y: auto;
      transition: all 0.3s ease;
    }

    .playlist-section {
      margin-top: 2rem;
      padding: 2rem;
      background-color: var(--surface-color);
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }

    .playlist-section h2 {
      margin: 0 0 1.5rem 0;
      color: var(--text-primary);
      font-size: 1.5rem;
      font-weight: 500;
      padding-left: 1rem;
      transition: color 0.3s ease;
    }
  `]
})
export class AppComponent {
  currentTheme = 'theme-default';

  constructor(private store: Store<{ music: MusicState }>) {
    // Load saved theme on startup
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.currentTheme = savedTheme;
    }
  }

  onThemeChange(theme: string) {
    console.log('Theme changed to:', theme);
    this.currentTheme = theme;
  }
}