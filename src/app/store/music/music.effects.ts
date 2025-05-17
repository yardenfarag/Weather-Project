import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, mergeMap, catchError, withLatestFrom } from 'rxjs/operators';
import { YouTubeService } from '../../services/youtube.service';
import * as MusicActions from './music.actions';
import { MusicState } from './music.state';

@Injectable()
export class MusicEffects {
  private actions$ = inject(Actions);
  private store = inject(Store<{ music: MusicState }>);
  private youtubeService = inject(YouTubeService);

  searchVideos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MusicActions.searchVideos),
      mergeMap(({ query }) => {
        console.log('Effect: Searching videos for query:', query);
        return this.youtubeService.searchVideos(query).pipe(
          map(videos => {
            console.log('Effect: Search results:', videos);
            return MusicActions.searchVideosSuccess({ videos });
          }),
          catchError(error => {
            console.error('Effect: Search error:', error);
            return of(MusicActions.searchVideosFailure({ error: error.message }));
          })
        );
      })
    )
  );

  loadMoodVideos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MusicActions.loadMoodVideos),
      mergeMap(({ mood }) => {
        console.log('Effect: Loading videos for mood:', mood);
        return this.youtubeService.getRecommendationsByMood(mood).pipe(
          map(videos => {
            console.log('Effect: Mood videos loaded:', videos);
            return MusicActions.searchVideosSuccess({ videos });
          }),
          catchError(error => {
            console.error('Effect: Mood videos error:', error);
            return of(MusicActions.searchVideosFailure({ error: error.message }));
          })
        );
      })
    )
  );

  playVideo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MusicActions.playVideo),
      withLatestFrom(this.store.select(state => state.music.currentVideo)),
      mergeMap(([_, video]) => {
        if (!video) {
          console.log('Effect: No video to play');
          return of(MusicActions.playVideoFailure({ error: 'No video selected' }));
        }
        console.log('Effect: Playing video:', video);
        this.youtubeService.playVideo(video.id);
        return of(MusicActions.playVideoSuccess());
      }),
      catchError(error => {
        console.error('Effect: Play error:', error);
        return of(MusicActions.playVideoFailure({ error: error.message }));
      })
    )
  );

  pauseVideo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MusicActions.pauseVideo),
      mergeMap(() => {
        console.log('Effect: Pausing video');
        this.youtubeService.pauseVideo();
        return of(MusicActions.pauseVideoSuccess());
      }),
      catchError(error => {
        console.error('Effect: Pause error:', error);
        return of(MusicActions.pauseVideoFailure({ error: error.message }));
      })
    )
  );
} 