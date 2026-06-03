import React from 'react';
import { Mic } from 'lucide-react';

interface VoiceRecorderProps {
  isRecording: boolean;
  recordingStatus: string;
  recordDuration: number;
  startRecording: () => void;
  stopRecording: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export function VoiceRecorder({
  isRecording,
  recordingStatus,
  recordDuration,
  startRecording,
  stopRecording,
  canvasRef
}: VoiceRecorderProps) {
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handleMicClick = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  return (
    <div className="voice-container">
      <label className="section-label">Describe Symptoms (Voice or Text)</label>
      <div className="voice-controls">
        <button 
          className={`record-btn ${isRecording ? 'recording' : ''}`}
          onClick={handleMicClick}
          type="button"
        >
          <div className="pulse-ring"></div>
          <Mic className="mic-icon" />
        </button>
        <div className="record-status-container">
          <span className={`timer ${isRecording ? 'recording' : ''}`}>
            {formatTime(recordDuration)}
          </span>
          <span className="status-text">{recordingStatus}</span>
        </div>
      </div>

      {/* Dynamic ECG visualizer */}
      <canvas 
        ref={canvasRef} 
        className="waveform-canvas" 
        width="400" 
        height="60"
        style={{ display: isRecording ? 'block' : 'none' }}
      />
    </div>
  );
}
export default VoiceRecorder;
