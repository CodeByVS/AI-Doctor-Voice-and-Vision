import { FileText, Shield } from 'lucide-react';
import AudioPlayer from './AudioPlayer';


interface DiagnosisPanelProps {
  transcript: string;
  typedResponse: string;
  loading: boolean;
  audioLoaded: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  audioStatusText: string;
  togglePlay: () => void;
  seek: (percentage: number) => void;
}

export function DiagnosisPanel({
  transcript,
  typedResponse,
  loading,
  audioLoaded,
  isPlaying,
  currentTime,
  duration,
  audioStatusText,
  togglePlay,
  seek
}: DiagnosisPanelProps) {
  return (
    <section className="panel glass-card right-panel">
      <div className="panel-header">
        <FileText className="panel-icon diagnosis-icon" />
        <h2>Diagnosis Report</h2>
      </div>

      {/* Scrollable container for text results */}
      <div className="results-container">
        {/* Patient Statement Transcription */}
        <div className="result-block patient-query">
          <div className="block-label">Patient Transcript / Notes</div>
          <div className={`block-content ${!transcript ? 'placeholder-text' : ''}`}>
            {transcript || "The transcribed statement or manual entry will appear here after filing the intake report."}
          </div>
        </div>

        {/* Doctor Diagnosis Notes */}
        <div className="result-block doctor-diagnosis">
          <div className="block-label">Final Report</div>
          
          {loading && (
            <div className="skeleton-wrapper">
              <div className="skeleton line"></div>
              <div className="skeleton line short"></div>
            </div>
          )}
          
          {!loading && (
            <div className={`block-content ${!typedResponse ? 'placeholder-text' : 'doctor-diagnosis-text'}`}>
              {typedResponse || "Once files are processed, the final report and recommended remedies will be detailed here."}
            </div>
          )}
        </div>
      </div>

      {/* Audio Playback Controls - Sticky at bottom */}
      <AudioPlayer 
        audioLoaded={audioLoaded}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        audioStatusText={audioStatusText}
        togglePlay={togglePlay}
        seek={seek}
      />

      {/* Disclaimer disclaimer - Sticky at bottom */}
      <div className="disclaimer">
        <Shield size={14} />
        <span>OmniDoc is an AI educational demonstration. Consult a licensed physician for medical advice.</span>
      </div>
    </section>
  );
}
export default DiagnosisPanel;
