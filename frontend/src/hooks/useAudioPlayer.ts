import { useState, useRef } from 'react';

export function useAudioPlayer() {
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioStatusText, setAudioStatusText] = useState('Audio not loaded');

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const setupAudio = (audioBase64: string) => {
    if (audioRef.current) {
      audioRef.current.src = `data:audio/mp3;base64,${audioBase64}`;
      audioRef.current.load();
      setAudioLoaded(true);
      setAudioStatusText("Audio ready to play");
      
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setAudioStatusText("Speaking...");
        })
        .catch(err => {
          console.log("Autoplay blocked.", err);
          setIsPlaying(false);
          setAudioStatusText("Audio paused");
        });
    }
  };

  const resetAudio = () => {
    if (audioRef.current) {
      audioRef.current.src = '';
    }
    setAudioLoaded(false);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setAudioStatusText('Audio not loaded');
  };

  const togglePlay = () => {
    if (!audioRef.current || !audioLoaded) return;
    
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
      setAudioStatusText("Speaking...");
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
      setAudioStatusText("Audio paused");
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    setAudioStatusText("Audio finished");
  };

  const seek = (percentage: number) => {
    if (!audioRef.current || !audioLoaded || !duration) return;
    audioRef.current.currentTime = percentage * duration;
    setCurrentTime(percentage * duration);
  };

  return {
    audioRef,
    audioLoaded,
    isPlaying,
    currentTime,
    duration,
    audioStatusText,
    setAudioStatusText,
    setupAudio,
    resetAudio,
    togglePlay,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleAudioEnded,
    seek,
  };
}
