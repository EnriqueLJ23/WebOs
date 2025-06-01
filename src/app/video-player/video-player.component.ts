// tv-player.component.ts
import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy, HostListener, inject, viewChild, signal, computed, effect } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { YouTubePlayer, YouTubePlayerModule } from '@angular/youtube-player';

interface Video {
  title: string;
  artist?: string;
  videoId: string;
}

@Component({
  selector: 'app-tv-player',
  standalone: true,
  imports: [CommonModule, YouTubePlayerModule],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.css'
})
export class VideoPlayerComponent  {
  	private document = inject(DOCUMENT);
  private player = viewChild<YouTubePlayer>('player');
	private videoDisplay = viewChild<ElementRef<HTMLElement>>('videoDisplay');
	
 playlist = signal<Video[]>([
		{
			title: 'THIS IS MF DOOM',
			artist: 'Davevo',
			videoId: 'qqB_hbK4koA'
		},
		{
			title: 'Million Dollar Baby',
			artist: 'GTO',
			videoId: 'as6ZQTDd7Pc'
		},
		{
			title: 'You are dead wrong.',
			artist: 'Pro Christian Gaming',
			videoId: 'Ji0nW8awNBs'
		},
		{
			title: 'Are you just living day to day?',
			artist: 'Shuzo Matsuoka',
			videoId: 'iEIqVq7EZqE'
		},
		{
			title: 'Macaco guts',
			artist: 'filho da puta',
			videoId: 'd6uN9xYUMxE'
		},
		{
			title: 'Pretty Boy',
			artist: 'JOJI',
			videoId: 'Qn5IpWXWub0'
		}
	]);

	currentVideoIndex = signal(0);
	isPoweredOn = signal(false);
	isPlaying = signal(false);
	isBuffering = signal(false);
	volume = signal(70);
	showVideo = signal(false);
  
	// Computed properties
	currentVideo = computed(() => this.playlist()[this.currentVideoIndex()]);
	displayTitle = computed(() => {
		const video = this.currentVideo();
		return video.artist ? `${video.artist} - ${video.title}` : video.title;
	});
	

	// Responsive video dimensions
	videoWidth = computed(() => {
		const screenWidth = this.document.defaultView?.innerWidth || 1024;
		
		if (screenWidth < 480) return 280;
		if (screenWidth < 768) return 400;
		if (screenWidth < 1024) return 560;
		return 640;
	});
	
videoHeight = computed(() => {
		const width = this.videoWidth();
		return Math.round(width * 9 / 16); // 16:9 aspect ratio
	});
	constructor() {
		// Auto-resize effect
		effect(() => {
			const handleResize = () => {
				// Trigger recomputation of video dimensions
				this.movePlayerToDisplay();
			};
			
			this.document.defaultView?.addEventListener('resize', handleResize);
			
			// Cleanup
			return () => {
				this.document.defaultView?.removeEventListener('resize', handleResize);
			};
		});
		
 // Auto-play effect when powered on
		effect(() => {
			if (this.isPoweredOn()) {
				this.showVideo.set(true);
				// Small delay to ensure player is ready
				setTimeout(() => {
					this.movePlayerToDisplay();
					this.play();
				}, 500);
			} else {
				this.pause();
				this.showVideo.set(false);
				this.isBuffering.set(false);
			}
		});
	}
private movePlayerToDisplay(): void {
		const playerInstance = this.player();
		const videoDisplayElement = this.videoDisplay();
		
		if (playerInstance && videoDisplayElement && this.isPoweredOn()) {
			const iframe = playerInstance.youtubeContainer.nativeElement.querySelector('iframe');
			if (iframe) {
				iframe.style.position = 'absolute';
				iframe.style.top = '0';
				iframe.style.left = '0';
				iframe.style.width = '100%';
				iframe.style.height = '100%';
				iframe.style.border = 'none';
				iframe.style.borderRadius = '8px';
			}
		}
	}

	onPlayerReady(): void {
		const playerInstance = this.player();
		if (playerInstance && this.isPoweredOn()) {
			playerInstance.setVolume(this.volume());
			this.movePlayerToDisplay();
		}
	}

	onPlayerStateChange(event: any): void {
		const state = event.data;
		
		switch (state) {
			case -1: // unstarted
				this.isPlaying.set(false);
				this.isBuffering.set(false);
				break;
			case 0: // ended
				this.isPlaying.set(false);
				this.isBuffering.set(false);
				this.handleVideoEnd();
				break;
			case 1: // playing
				this.isPlaying.set(true);
				this.isBuffering.set(false);
				this.showVideo.set(true);
				this.movePlayerToDisplay();
				break;
			case 2: // paused
				this.isPlaying.set(false);
				this.isBuffering.set(false);
				break;
			case 3: // buffering
				this.isBuffering.set(true);
				break;
			case 5: // cued
				this.isPlaying.set(false);
				this.isBuffering.set(false);
				break;
		}
	}

	private handleVideoEnd(): void {
		this.nextVideo();
	}

	togglePower(): void {
		this.isPoweredOn.update(powered => !powered);
	}

	togglePlayPause(): void {
		if (!this.isPoweredOn()) return;
		
		if (this.isPlaying()) {
			this.pause();
		} else {
			this.play();
		}
	}

	play(): void {
		const playerInstance = this.player();
		if (playerInstance && this.isPoweredOn()) {
			playerInstance.playVideo();
		}
	}

	pause(): void {
		const playerInstance = this.player();
		if (playerInstance) {
			playerInstance.pauseVideo();
		}
	}

	previousVideo(): void {
		if (!this.isPoweredOn()) return;
		
		this.currentVideoIndex.update(index => 
			index > 0 ? index - 1 : this.playlist().length - 1
		);
		this.resetVideoState();
	}

	nextVideo(): void {
		if (!this.isPoweredOn()) return;
		
		this.currentVideoIndex.update(index => 
			index < this.playlist().length - 1 ? index + 1 : 0
		);
		this.resetVideoState();
	}

	skipForward(): void {
		const playerInstance = this.player();
		if (!this.isPoweredOn() || !playerInstance) return;
		
		const currentTime = playerInstance.getCurrentTime();
		const duration = playerInstance.getDuration();
		const newTime = Math.min(currentTime + 10, duration - 1);
		
		playerInstance.seekTo(newTime, true);
	}

	setVolume(event: Event): void {
		const target = event.target as HTMLInputElement;
		const newVolume = parseInt(target.value);
		this.volume.set(newVolume);
		
		const playerInstance = this.player();
		if (playerInstance && this.isPoweredOn()) {
			playerInstance.setVolume(newVolume);
		}
	}

	private resetVideoState(): void {
		this.isPlaying.set(false);
		this.isBuffering.set(false);
		this.showVideo.set(this.isPoweredOn());
		
		// Small delay to allow YouTube player to load new video
		setTimeout(() => {
			this.movePlayerToDisplay();
		}, 500);
	}
}