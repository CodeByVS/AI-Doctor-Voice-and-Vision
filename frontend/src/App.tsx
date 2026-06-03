import { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import IntakePanel from './components/IntakePanel';
import DiagnosisPanel from './components/DiagnosisPanel';
import { useAudioRecorder } from './hooks/useAudioRecorder';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import type { SampleCase } from './types';
import { DEFAULT_MODEL } from './config/constants';


export default function App() {
  // 1. Settings & Persistent Preferences State
  const [model, setModel] = useState<string>(() => {
    return localStorage.getItem('omnidoc_model') || DEFAULT_MODEL;
  });

  useEffect(() => {
    localStorage.setItem('omnidoc_model', model);
  }, [model]);

  // Migrate decommissioned models from browser cache
  useEffect(() => {
    const savedModel = localStorage.getItem('omnidoc_model');
    if (savedModel && savedModel.includes('llama-3.2-')) {
      setModel(DEFAULT_MODEL);
      localStorage.setItem('omnidoc_model', DEFAULT_MODEL);
    }
  }, []);

  // 2. User Input & Media State
  const [textQuery, setTextQuery] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  
  // 3. Consultation Response State
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [typedResponse, setTypedResponse] = useState('');

  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const typewriterTimeoutRef = useRef<any>(null);

  // Custom Hooks
  const {
    isRecording,
    recordingStatus,
    recordDuration,
    audioBlob,
    startRecording,
    stopRecording,
    resetRecording
  } = useAudioRecorder(canvasRef);

  const {
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
    seek
  } = useAudioPlayer();

  useEffect(() => {
    return () => {
      if (typewriterTimeoutRef.current) clearTimeout(typewriterTimeoutRef.current);
    };
  }, []);

  // Image actions
  const handleImageSelect = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImagePreview(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImageRemove = () => {
    setImageFile(null);
    setImagePreview('');
  };

  // Click demo sample cases
  const loadSampleCase = async (sample: SampleCase) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/samples/${sample.file}`);
      if (!res.ok) throw new Error("Demo case image not found on server.");
      const blob = await res.blob();
      const file = new File([blob], sample.file, { type: blob.type });
      
      handleImageSelect(file);
      setTextQuery(sample.query);
    } catch (err: any) {
      alert("Error loading demo case: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Typewriter effect
  const startTypewriter = (text: string) => {
    if (typewriterTimeoutRef.current) clearTimeout(typewriterTimeoutRef.current);
    setTypedResponse('');
    const speed = 12;

    const type = (index: number) => {
      if (index <= text.length) {
        setTypedResponse(text.substring(0, index));
        typewriterTimeoutRef.current = setTimeout(() => type(index + 1), speed);
      }
    };
    type(1);
  };


  // Submit consultation report
  const handleSubmit = async () => {
    if (!imageFile && !audioBlob && !textQuery.trim()) {
      alert("Please provide at least one input: upload a photo, load a demo case, or describe your symptoms.");
      return;
    }

    setLoading(true);
    setTranscript(audioBlob ? "Transcribing voice statement..." : (textQuery.trim() || "Image assessment request"));
    setTypedResponse('');
    resetAudio();

    const formData = new FormData();
    if (imageFile) {
      formData.append('image', imageFile);
    }
    if (audioBlob) {
      formData.append('audio', audioBlob, 'patient_voice.webm');
    }
    if (textQuery.trim()) {
      formData.append('text_query', textQuery.trim());
    }
    formData.append('model', model);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Consultation analysis failed.");
      }

      const result = await res.json();
      setTranscript(result.transcription || "[No speech text captured]");
      
      // Run typewriter animation
      startTypewriter(result.response);

      if (result.audio) {
        setupAudio(result.audio);
      } else {
        setAudioStatusText("Prescription audio unavailable");
      }
    } catch (err: any) {
      console.error(err);
      setTypedResponse(`Analysis Error: ${err.message}. Please verify API keys and network connection.`);
      setAudioStatusText("Audio generation failed");
    } finally {
      setLoading(false);
      resetRecording();
    }
  };

  return (
    <div>
      <div className="glow-bg"></div>
      
      <div className="app-container">
        {/* Header bar */}
        <Header />

        {/* 2-Column Dashboard Grid */}
        <main className="dashboard-grid">
          {/* Column 1: Intake & Controls panel */}
          <IntakePanel 
            model={model}
            setModel={setModel}
            onSelectCase={loadSampleCase}
            imagePreview={imagePreview}
            onImageSelect={handleImageSelect}
            onImageRemove={handleImageRemove}
            isRecording={isRecording}
            recordingStatus={recordingStatus}
            recordDuration={recordDuration}
            startRecording={startRecording}
            stopRecording={stopRecording}
            canvasRef={canvasRef}
            textQuery={textQuery}
            setTextQuery={setTextQuery}
            loading={loading}
            onSubmit={handleSubmit}
          />

          {/* Column 2: Sleek Output Report Panel */}
          <DiagnosisPanel 
            transcript={transcript}
            typedResponse={typedResponse}
            loading={loading}
            audioLoaded={audioLoaded}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            audioStatusText={audioStatusText}
            togglePlay={togglePlay}
            seek={seek}
          />
        </main>
      </div>

      {/* HTML5 Audio Node */}
      <audio 
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleAudioEnded}
        style={{ display: 'none' }}
      />
    </div>
  );
}
