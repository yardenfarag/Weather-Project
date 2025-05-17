import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideClientHydration } from '@angular/platform-browser';
import { routes } from './app.routes';
import { musicReducer } from './store/music/music.reducer';
import { MusicEffects } from './store/music/music.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideStore({ music: musicReducer }),
    provideEffects([MusicEffects]),
    provideHttpClient(),
    provideAnimations(),
    provideClientHydration()
  ]
};
