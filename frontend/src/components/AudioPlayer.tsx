import React from 'react';
import { Volume2, Play, Pause } from 'lucide-react';

interface AudioPlayerProps {
  audioLoaded: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  audioStatusText: string;
  togglePlay: () => void;
  seek: (percentage: number) => void;
}

export function AudioPlayer({
  audioLoaded,
  isPlaying,
  currentTime,
  duration,
  audioStatusText,
  togglePlay,
  seek
}: AudioPlayerProps) {
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioLoaded || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    seek(percentage);
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div 
      className="audio-player-card" 
      style={{ 
        opacity: audioLoaded ? 1 : 0.3, 
        pointerEvents: audioLoaded ? 'auto' : 'none' 
      }}
    >
      <div className="audio-info">
        <Volume2 size={24} color="var(--accent-cyan)" />
        <div>
          <span className="audio-title">Audio Diagnosis Report</span>
          <span className="audio-subtitle">{audioStatusText}</span>
        </div>
      </div>
      <div className="audio-controls-row">
        <button 
          className="audio-control-btn" 
          disabled={!audioLoaded}
          onClick={togglePlay}
          type="button"
        >
          {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
        </button>
        <div 
          className="progress-bar-container"
          onClick={handleProgressBarClick}
        >
          <div 
            className="progress-bar" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <span className="audio-time">
          {formatTime(Math.floor(currentTime))} / {formatTime(Math.floor(duration))}
        </span>
      </div>
    </div>
  );
}
export default AudioPlayer;
