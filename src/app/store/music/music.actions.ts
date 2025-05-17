import { createAction, props } from '@ngrx/store';
import { YouTubeVideo } from '../../services/youtube.service';

// Search actions
export const searchVideos = createAction(
  '[Music] Search Videos',
  props<{ query: string }>()
);

export const searchVideosSuccess = createAction(
  '[Music] Search Videos Success',
  props<{ videos: YouTubeVideo[] }>()
);

export const searchVideosFailure = createAction(
  '[Music] Search Videos Failure',
  props<{ error: string }>()
);

// Mood actions
export const setMood = createAction(
  '[Music] Set Mood',
  props<{ mood: string }>()
);

export const loadMoodVideos = createAction(
  '[Music] Load Mood Videos',
  props<{ mood: string }>()
);

export const loadMoodVideosSuccess = createAction(
  '[Music] Load Mood Videos Success',
  props<{ videos: YouTubeVideo[] }>()
);

export const loadMoodVideosFailure = createAction(
  '[Music] Load Mood Videos Failure',
  props<{ error: any }>()
);

// Playback actions
export const playVideo = createAction(
  '[Music] Play Video'
);

export const playVideoSuccess = createAction(
  '[Music] Play Video Success'
);

export const playVideoFailure = createAction(
  '[Music] Play Video Failure',
  props<{ error: string }>()
);

export const pauseVideo = createAction(
  '[Music] Pause Video'
);

export const pauseVideoSuccess = createAction(
  '[Music] Pause Video Success'
);

export const pauseVideoFailure = createAction(
  '[Music] Pause Video Failure',
  props<{ error: string }>()
);

export const togglePlay = createAction(
  '[Music] Toggle Play'
);

export const setCurrentVideo = createAction(
  '[Music] Set Current Video',
  props<{ video: YouTubeVideo }>()
);

export const previousTrack = createAction(
  '[Music] Previous Track'
);

export const nextTrack = createAction(
  '[Music] Next Track'
);

export const updateProgress = createAction(
  '[Music] Update Progress',
  props<{ progress: number }>()
);

export const addToPlaylist = createAction(
  '[Music] Add to Playlist',
  props<{ video: YouTubeVideo }>()
);

export const removeFromPlaylist = createAction(
  '[Music] Remove from Playlist',
  props<{ videoId: string }>()
);

export const clearPlaylist = createAction(
  '[Music] Clear Playlist'
); 