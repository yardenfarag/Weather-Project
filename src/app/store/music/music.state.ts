import { YouTubeVideo } from '../../services/youtube.service';

export interface MusicState {
  currentVideo: YouTubeVideo | null;
  isPlaying: boolean;
  progress: number;
  searchResults: YouTubeVideo[];
  playlist: YouTubeVideo[];
  selectedMood: string | null;
  loading: boolean;
  error: any;
}

export const initialState: MusicState = {
  currentVideo: null,
  isPlaying: false,
  progress: 0,
  searchResults: [],
  playlist: [],
  selectedMood: null,
  loading: false,
  error: null
}; 