import { createReducer, on } from '@ngrx/store';
import * as MusicActions from './music.actions';
import { MusicState, initialState } from './music.state';

export const musicReducer = createReducer(
  initialState,

  // Search actions
  on(MusicActions.searchVideos, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(MusicActions.searchVideosSuccess, (state, { videos }) => ({
    ...state,
    searchResults: videos
  })),

  on(MusicActions.searchVideosFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  // Mood actions
  on(MusicActions.loadMoodVideos, (state) => ({
    ...state,
    error: null
  })),

  on(MusicActions.loadMoodVideosSuccess, (state, { videos }) => ({
    ...state,
    playlist: videos,
    error: null
  })),

  on(MusicActions.loadMoodVideosFailure, (state, { error }) => ({
    ...state,
    error
  })),

  // Playback actions
  on(MusicActions.setCurrentVideo, (state, { video }) => ({
    ...state,
    currentVideo: video,
    isPlaying: false,
    progress: 0
  })),

  on(MusicActions.playVideo, (state) => ({
    ...state,
    isPlaying: true
  })),

  on(MusicActions.playVideoSuccess, (state) => ({
    ...state,
    isPlaying: true
  })),

  on(MusicActions.pauseVideo, (state) => ({
    ...state,
    isPlaying: false
  })),

  on(MusicActions.pauseVideoSuccess, (state) => ({
    ...state,
    isPlaying: false
  })),

  on(MusicActions.togglePlay, (state) => ({
    ...state,
    isPlaying: !state.isPlaying
  })),

  on(MusicActions.updateProgress, (state, { progress }) => ({
    ...state,
    progress
  })),

  on(MusicActions.nextTrack, (state) => {
    if (!state.playlist.length) return state;
    
    const currentIndex = state.currentVideo 
      ? state.playlist.findIndex(video => video.id === state.currentVideo?.id)
      : -1;
    
    const nextIndex = (currentIndex + 1) % state.playlist.length;
    return {
      ...state,
      currentVideo: state.playlist[nextIndex],
      isPlaying: true,
      progress: 0
    };
  }),

  on(MusicActions.previousTrack, (state) => {
    if (!state.playlist.length) return state;
    
    const currentIndex = state.currentVideo 
      ? state.playlist.findIndex(video => video.id === state.currentVideo?.id)
      : -1;
    
    const prevIndex = currentIndex <= 0 
      ? state.playlist.length - 1 
      : currentIndex - 1;
    
    return {
      ...state,
      currentVideo: state.playlist[prevIndex],
      isPlaying: true,
      progress: 0
    };
  }),

  on(MusicActions.addToPlaylist, (state, { video }) => ({
    ...state,
    playlist: [...state.playlist, video]
  })),

  on(MusicActions.removeFromPlaylist, (state, { videoId }) => ({
    ...state,
    playlist: state.playlist.filter(video => video.id !== videoId)
  })),

  on(MusicActions.clearPlaylist, (state) => ({
    ...state,
    playlist: []
  })),

  // Mood actions
  on(MusicActions.setMood, (state, { mood }) => ({
    ...state,
    selectedMood: mood
  })),

  on(MusicActions.loadMoodVideosSuccess, (state, { videos }) => ({
    ...state,
    searchResults: videos
  }))
); 