// music-player.component.ts
import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YouTubePlayer, YouTubePlayerModule } from '@angular/youtube-player';

interface Track {
  title: string;
  artist: string;
  videoId: string;
}

@Component({
  selector: 'app-music-player',
  standalone: true,
  imports: [CommonModule, YouTubePlayerModule],
  templateUrl: './music-player.component.html',
  styleUrl: './music-player.component.css'
})
export class MusicPlayerComponent implements   AfterViewInit {
  @ViewChild('player') player!: YouTubePlayer;

 // Track management
  playlist: Track[] = [
    {
      title: 'Sextape',
      artist: 'Deftones',
      videoId: 'f0pdwd0miqs'
    },
    {
      title: 'Call Me Maybe',
      artist: 'Carly Rae Jepsen',
      videoId: 'fWNaR-rxAic'
    },
    {
      title: ' This Modern Love ',
      artist: 'Bloc Party',
      videoId: 'gpyXaICxTuI'
    },
    {
      title: 'Crush',
      artist: 'Jennifer Paige',
      videoId: 'hYGJel4SsAs'
    },
    {
      title: 'Bauklötze',
      artist: 'Attack on titan',
      videoId: 'h_YM96zS3-8'
    },
    
    {
      title: 'Quiets Theme',
      artist: 'MGSV',
      videoId: 'wQWC14HCKYI'
    }
    
  ];

   currentTrackIndex = 0;
  isPlaying = false;
  volume = 70;
  currentTime = 0;
  duration = 0;
  progressPercentage = 0;
  private updateInterval: any;

  get currentTrack(): Track {
    return this.playlist[this.currentTrackIndex];
  }

  

  ngAfterViewInit() {
    // Start update interval for progress tracking
    this.updateInterval = setInterval(() => {
      if (this.player && this.isPlaying) {
        this.updateProgress();
      }
    }, 1000);
  }

  ngOnDestroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

  onPlayerReady() {
    if (this.player) {
      this.player.setVolume(this.volume);
      this.duration = this.player.getDuration();
    }
  }

  onPlayerStateChange(event: any) {
    const state = event.data;
    // YouTube Player States: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (cued)
    this.isPlaying = state === 1;
    
    if (state === 0) { // ended
      this.handleTrackEnd();
    }
    
    // Update duration when video is loaded
    if (state === 1 || state === 2) {
      setTimeout(() => {
        this.duration = this.player.getDuration();
      }, 100);
    }
  }

  private handleTrackEnd() {
    // Go to next track, or back to first track if at end
    this.nextTrack();
  
  }

  togglePlayPause() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    if (this.player) {
      this.player.playVideo();
      this.isPlaying = true;
    }
  }

  pause() {
    if (this.player) {
      this.player.pauseVideo();
      this.isPlaying = false;
    }
  }

  previousTrack() {
    // Go to previous track, or last track if at beginning
    this.currentTrackIndex = this.currentTrackIndex > 0 
      ? this.currentTrackIndex - 1 
      : this.playlist.length - 1;
    
    // Reset progress
    this.currentTime = 0;
    this.progressPercentage = 0;
  }

  nextTrack() {
    // Go to next track, or first track if at end
    this.currentTrackIndex = this.currentTrackIndex < this.playlist.length - 1 
      ? this.currentTrackIndex + 1 
      : 0;
    
    // Reset progress
    this.currentTime = 0;
    this.progressPercentage = 0;
  }

  selectTrack(index: number) {
    this.currentTrackIndex = index;
    // Reset progress
    this.currentTime = 0;
    this.progressPercentage = 0;
  }

  setVolume(event: any) {
    this.volume = parseInt(event.target.value);
    if (this.player) {
      this.player.setVolume(this.volume);
    }
  }

  seekTo(event: MouseEvent) {
    if (this.player && this.duration > 0) {
      const progressBar = event.currentTarget as HTMLElement;
      const rect = progressBar.getBoundingClientRect();
      const percentage = (event.clientX - rect.left) / rect.width;
      const newTime = percentage * this.duration;
      this.player.seekTo(newTime, true);
    }
  }

  private updateProgress() {
    if (this.player) {
      this.currentTime = this.player.getCurrentTime();
      this.duration = this.player.getDuration();
      this.progressPercentage = this.duration > 0 ? (this.currentTime / this.duration) * 100 : 0;
    }
  }

  formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}