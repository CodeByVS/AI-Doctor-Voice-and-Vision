export interface SampleCase {
  id: string;
  name: string;
  file: string;
  query: string;
  description: string;
}

export interface ConsultationResponse {
  transcription: string;
  response: string;
  audio: string | null;
  audio_type: string;
}
