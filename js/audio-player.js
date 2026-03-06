/**
 * Audio Player for Joey's Beats Collective
 * Handles audio playback with waveform visualization
 */

class AudioPlayer {
    constructor(container) {
        this.container = container;
        this.audioPath = container.dataset.audio;
        this.playBtn = container.querySelector('.play-btn');
        this.timeDisplay = container.querySelector('.audio-time');
        this.canvas = container.querySelector('.waveform');
        this.ctx = this.canvas.getContext('2d');
        
        this.audio = null;
        this.isPlaying = false;
        this.currentTime = 0;
        this.duration = 0;
        
        this.init();
    }
    
    init() {
        // Setup canvas
        this.setupCanvas();
        
        // Draw initial waveform
        this.drawWaveform();
        
        // Add event listeners
        this.playBtn.addEventListener('click', () => this.togglePlay());
        
        // Create audio element
        this.audio = new Audio(this.audioPath);
        
        this.audio.addEventListener('loadedmetadata', () => {
            this.duration = this.audio.duration;
        });
        
        this.audio.addEventListener('timeupdate', () => {
            this.currentTime = this.audio.currentTime;
            this.updateDisplay();
            this.drawWaveform();
        });
        
        this.audio.addEventListener('ended', () => {
            this.stop();
        });
        
        this.audio.addEventListener('error', () => {
            console.error('Error loading audio:', this.audioPath);
            this.playBtn.style.opacity = '0.5';
            this.playBtn.style.cursor = 'not-allowed';
        });
    }
    
    setupCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * window.devicePixelRatio;
        this.canvas.height = rect.height * window.devicePixelRatio;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    
    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    play() {
        // Stop all other players
        window.audioPlayers.forEach(player => {
            if (player !== this) {
                player.stop();
            }
        });
        
        this.audio.play();
        this.isPlaying = true;
        this.playBtn.classList.add('playing');
    }
    
    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.playBtn.classList.remove('playing');
    }
    
    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.isPlaying = false;
        this.playBtn.classList.remove('playing');
        this.currentTime = 0;
        this.updateDisplay();
        this.drawWaveform();
    }
    
    updateDisplay() {
        const minutes = Math.floor(this.currentTime / 60);
        const seconds = Math.floor(this.currentTime % 60);
        this.timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    drawWaveform() {
        const rect = this.canvas.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        
        this.ctx.clearRect(0, 0, width, height);
        
        // Draw waveform bars
        const bars = 40;
        const barWidth = width / bars;
        const progress = this.duration > 0 ? this.currentTime / this.duration : 0;
        
        for (let i = 0; i < bars; i++) {
            const barHeight = (Math.sin(i * 0.5) * 0.5 + 0.5) * height * 0.7;
            const x = i * barWidth;
            const y = (height - barHeight) / 2;
            
            // Color based on progress
            if (i / bars < progress) {
                this.ctx.fillStyle = '#D5B336';
            } else {
                this.ctx.fillStyle = 'rgba(213, 179, 54, 0.3)';
            }
            
            this.ctx.fillRect(x + barWidth * 0.2, y, barWidth * 0.6, barHeight);
        }
    }
}

// Initialize all audio players when DOM is ready
window.audioPlayers = [];

document.addEventListener('DOMContentLoaded', () => {
    const playerContainers = document.querySelectorAll('.audio-player');
    
    playerContainers.forEach(container => {
        const player = new AudioPlayer(container);
        window.audioPlayers.push(player);
    });
});

// Handle window resize
window.addEventListener('resize', () => {
    window.audioPlayers.forEach(player => {
        player.setupCanvas();
        player.drawWaveform();
    });
});
