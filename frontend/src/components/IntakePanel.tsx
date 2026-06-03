import { Activity, Send } from 'lucide-react';
import type { SampleCase } from '../types';
import SampleCases from './SampleCases';
import ImageDropZone from './ImageDropZone';
import VoiceRecorder from './VoiceRecorder';


interface IntakePanelProps {
  model: string;
  setModel: (model: string) => void;
  onSelectCase: (sample: SampleCase) => void;
  imagePreview: string;
  onImageSelect: (file: File) => void;
  onImageRemove: () => void;
  isRecording: boolean;
  recordingStatus: string;
  recordDuration: number;
  startRecording: () => void;
  stopRecording: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  textQuery: string;
  setTextQuery: (text: string) => void;
  loading: boolean;
  onSubmit: () => void;
}

export function IntakePanel({
  model,
  setModel,
  onSelectCase,
  imagePreview,
  onImageSelect,
  onImageRemove,
  isRecording,
  recordingStatus,
  recordDuration,
  startRecording,
  stopRecording,
  canvasRef,
  textQuery,
  setTextQuery,
  loading,
  onSubmit
}: IntakePanelProps) {
  return (
    <section className="panel glass-card left-panel">
      <div className="panel-header">
        <Activity className="panel-icon" />
        <h2>Consultation Setup & Intake</h2>
      </div>

      {/* Scrollable inner content container */}
      <div className="panel-scroll-content">
        {/* Model configuration selection */}
        <div className="settings-group" style={{ gridTemplateColumns: '1fr' }}>
          <div className="setting-item">
            <label htmlFor="model-select">Clinical Decision Engine</label>
            <select 
              id="model-select" 
              value={model} 
              onChange={(e) => setModel(e.target.value)}
            >
              <option value="meta-llama/llama-4-scout-17b-16e-instruct">Llama 4 Vision 17B</option>
            </select>
          </div>
        </div>

        {/* Quick Intake Demo Case Studies */}
        <SampleCases onSelectCase={onSelectCase} disabled={loading || isRecording} />

        {/* Image Drop Zone */}
        <ImageDropZone 
          imagePreview={imagePreview} 
          onImageSelect={onImageSelect} 
          onImageRemove={onImageRemove} 
        />

        {/* Voice Input Zone */}
        <VoiceRecorder 
          isRecording={isRecording}
          recordingStatus={recordingStatus}
          recordDuration={recordDuration}
          startRecording={startRecording}
          stopRecording={stopRecording}
          canvasRef={canvasRef}
        />

        {/* Typed Input Area */}
        <div className="text-query-container">
          <span className="divider-text">OR ENTER MANUAL NOTES</span>
          <textarea 
            value={textQuery} 
            onChange={(e) => setTextQuery(e.target.value)}
            placeholder="Record symptoms statement or special concerns..." 
            rows={3} 
          />
        </div>
      </div>

      {/* Main Submit Action - Sticky at bottom */}
      <button 
        className={`submit-btn ${loading ? 'loading' : ''}`}
        disabled={loading || isRecording}
        onClick={onSubmit}
        type="button"
      >
        {loading ? (
          <div className="spinner"></div>
        ) : (
          <>
            <span>File Intake Report</span>
            <Send size={18} />
          </>
        )}
      </button>
    </section>
  );
}
export default IntakePanel;
