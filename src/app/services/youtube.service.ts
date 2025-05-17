import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap, of, Subject, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnailUrl: string;
  channelTitle: string;
  duration: string;
  viewCount: string;
}

@Injectable({
  providedIn: 'root'
})
export class YouTubeService {
  private apiKey = environment.youtubeApiKey;
  private baseUrl = 'https://www.googleapis.com/youtube/v3';
  private player: any = null;
  private playerReady = new Subject<void>();
  private playerStateChange = new Subject<number>();
  private currentTime = new BehaviorSubject<number>(0);
  private duration = new BehaviorSubject<number>(0);
  private progressInterval: any = null;

  constructor(private http: HttpClient) {
    this.initializeYouTubePlayer();
  }

  private initializeYouTubePlayer() {
    console.log('Initializing YouTube player');
    // Load the YouTube IFrame API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
      console.log('YouTube IFrame API Ready');
      this.player = new window.YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: '',
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          enablejsapi: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0
        },
        events: {
          onReady: () => {
            console.log('Player ready');
            this.playerReady.next();
            this.startProgressTracking();
          },
          onStateChange: (event: any) => {
            console.log('Player state changed:', event.data);
            this.playerStateChange.next(event.data);
            if (event.data === window.YT.PlayerState.ENDED) {
              this.stopProgressTracking();
            }
          },
          onError: (event: any) => {
            console.error('Player error:', event.data);
          }
        }
      });
    };
  }

  private startProgressTracking() {
    console.log('Starting progress tracking');
    this.progressInterval = setInterval(() => {
      if (this.player && this.player.getCurrentTime) {
        const currentTime = this.player.getCurrentTime();
        const duration = this.player.getDuration();
        this.currentTime.next(currentTime);
        this.duration.next(duration);
      }
    }, 1000);
  }

  private stopProgressTracking() {
    console.log('Stopping progress tracking');
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  playVideo(videoId: string) {
    console.log('Playing video with ID:', videoId);
    if (this.player) {
      this.player.loadVideoById(videoId);
      this.startProgressTracking();
    } else {
      console.error('Player not initialized');
    }
  }

  pauseVideo() {
    console.log('Pausing video');
    if (this.player) {
      this.player.pauseVideo();
      this.stopProgressTracking();
    } else {
      console.error('Player not initialized');
    }
  }

  resumeVideo() {
    console.log('Resuming video');
    if (this.player) {
      this.player.playVideo();
      this.startProgressTracking();
    } else {
      console.error('Player not initialized');
    }
  }

  getPlayerState(): Observable<number> {
    return this.playerStateChange.asObservable();
  }

  getPlayerReady(): Observable<void> {
    return this.playerReady.asObservable();
  }

  getCurrentTime(): Observable<number> {
    return this.currentTime.asObservable();
  }

  getDuration(): Observable<number> {
    return this.duration.asObservable();
  }

  searchVideos(query: string): Observable<YouTubeVideo[]> {
    console.log('Searching videos with query:', query);
    const url = `${this.baseUrl}/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=10&key=${this.apiKey}`;
    return this.http.get<any>(url).pipe(
      map(response => {
        console.log('Search response:', response);
        return response.items || [];
      }),
      switchMap(items => {
        if (!items || items.length === 0) {
          console.log('No search results found');
          return of([]);
        }
        const videoIds = items.map((item: any) => item.id.videoId);
        return this.getVideoDetails(videoIds).pipe(
          map(details => {
            const videos = items.map((item: any, index: number) => ({
              id: item.id.videoId,
              title: item.snippet.title,
              thumbnailUrl: item.snippet.thumbnails.high.url,
              channelTitle: item.snippet.channelTitle,
              duration: details[index]?.duration || '0:00',
              viewCount: details[index]?.viewCount || '0'
            }));
            console.log('Processed videos:', videos);
            return videos;
          })
        );
      })
    );
  }

  getVideoDetails(videoIds: string[]): Observable<YouTubeVideo[]> {
    const ids = videoIds.join(',');
    const url = `${this.baseUrl}/videos?part=contentDetails,statistics&id=${ids}&key=${this.apiKey}`;
    return this.http.get<any>(url).pipe(
      map(response => {
        console.log('Video details response:', response);
        if (!response.items) {
          return [];
        }
        return response.items.map((item: any) => ({
          id: item.id,
          duration: this.formatDuration(item.contentDetails.duration),
          viewCount: item.statistics.viewCount
        }));
      })
    );
  }

  getRecommendationsByMood(mood: string): Observable<YouTubeVideo[]> {
    console.log('Getting recommendations for mood:', mood);
    const moodQueries: { [key: string]: string } = {
      happy: 'happy upbeat music playlist',
      sad: 'sad emotional music playlist',
      energetic: 'energetic workout music playlist',
      relaxed: 'relaxing meditation music playlist',
      angry: 'intense metal music playlist',
      nostalgic: 'nostalgic 90s music playlist'
    };

    const query = moodQueries[mood] || 'music playlist';
    return this.searchVideos(query);
  }

  private formatDuration(duration: string): string {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return '0:00';

    const hours = match[1] ? parseInt(match[1]) : 0;
    const minutes = match[2] ? parseInt(match[2]) : 0;
    const seconds = match[3] ? parseInt(match[3]) : 0;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
} 