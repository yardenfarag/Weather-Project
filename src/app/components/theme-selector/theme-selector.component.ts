import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Theme {
  name: string;
  class: string;
  icon: string;
}

@Component({
  selector: 'app-theme-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="theme-selector">
      <button class="dropdown-button" (click)="toggleDropdown($event)">
        <i class="material-icons">{{ currentThemeIcon }}</i>
        <span>{{ currentThemeName }}</span>
        <i class="material-icons dropdown-icon">arrow_drop_down</i>
      </button>
      
      <div class="dropdown-content" [class.show]="isOpen">
        <button 
          *ngFor="let theme of themes" 
          (click)="selectTheme(theme, $event)"
          [class.active]="currentTheme === theme.class"
        >
          <i class="material-icons">{{ theme.icon }}</i>
          <span>{{ theme.name }}</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .theme-selector {
      position: relative;
    }

    .dropdown-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      background: var(--surface-color);
      color: var(--text-primary);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .dropdown-button:hover {
      background: var(--surface-hover);
    }

    .dropdown-icon {
      margin-left: 0.5rem;
      transition: transform 0.2s ease;
    }

    .show .dropdown-icon {
      transform: rotate(180deg);
    }

    .dropdown-content {
      display: none;
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 0.5rem;
      min-width: 200px;
      background: var(--surface-color);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      z-index: 1000;
    }

    .dropdown-content.show {
      display: block;
    }

    .dropdown-content button {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      border: none;
      background: none;
      color: var(--text-primary);
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .dropdown-content button:hover {
      background: var(--surface-hover);
    }

    .dropdown-content button.active {
      background: var(--primary-color);
      color: white;
    }

    .material-icons {
      font-size: 20px;
    }

    span {
      font-size: 0.9rem;
    }
  `]
})
export class ThemeSelectorComponent implements OnInit, OnDestroy {
  @Output() themeChange = new EventEmitter<string>();

  themes: Theme[] = [
    { name: 'Default', class: 'theme-default', icon: 'palette' },
    { name: 'Dark', class: 'theme-dark', icon: 'dark_mode' },
    { name: 'Warm', class: 'theme-warm', icon: 'local_fire_department' },
    { name: 'Pinky', class: 'theme-pinky', icon: 'favorite' },
    { name: 'Nature', class: 'theme-nature', icon: 'park' },
    { name: 'Sunny', class: 'theme-sunny', icon: 'wb_sunny' },
    { name: 'Ocean', class: 'theme-ocean', icon: 'water' }
  ];

  currentTheme = 'theme-default';
  currentThemeName = 'Default';
  currentThemeIcon = 'palette';
  isOpen = false;
  private clickListener: (event: MouseEvent) => void;

  constructor() {
    this.clickListener = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.theme-selector')) {
        this.isOpen = false;
      }
    };
  }

  selectTheme(theme: Theme, event: Event) {
    event.stopPropagation();
    console.log('Selecting theme:', theme);
    
    // Remove all theme classes from body
    document.body.classList.remove(...this.themes.map(t => t.class));
    console.log('Removed all theme classes');
    
    // Add selected theme class
    document.body.classList.add(theme.class);
    console.log('Added theme class:', theme.class);
    console.log('Current body classes:', document.body.classList.toString());
    
    this.currentTheme = theme.class;
    this.currentThemeName = theme.name;
    this.currentThemeIcon = theme.icon;
    
    // Save theme preference
    localStorage.setItem('theme', theme.class);
    console.log('Saved theme to localStorage:', theme.class);
    
    // Emit theme change
    this.themeChange.emit(theme.class);
    
    // Close dropdown
    this.isOpen = false;
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isOpen = !this.isOpen;
  }

  ngOnInit() {
    console.log('ThemeSelector initialized');
    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme');
    console.log('Loaded saved theme:', savedTheme);
    
    if (savedTheme) {
      const theme = this.themes.find(t => t.class === savedTheme);
      if (theme) {
        console.log('Found saved theme:', theme);
        this.selectTheme(theme, new Event('init'));
      }
    } else {
      console.log('No saved theme found, using default');
      // Set default theme
      this.selectTheme(this.themes[0], new Event('init'));
    }

    // Add click listener for closing dropdown
    document.addEventListener('click', this.clickListener);
  }

  ngOnDestroy() {
    // Remove click listener
    document.removeEventListener('click', this.clickListener);
  }
} 