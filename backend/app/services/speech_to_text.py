import os
import logging
from io import BytesIO
import speech_recognition as sr
from pydub import AudioSegment
from groq import Groq

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Configure pydub FFMPEG path if provided in environment variables
if os.environ.get("FFMPEG_PATH"):
    AudioSegment.converter = os.environ.get("FFMPEG_PATH")

def record_audio(file_path: str, timeout: int = 20, phrase_time_limit: int = None):
    """
    Records audio from the microphone and saves it as an MP3 file.
    """
    recognizer = sr.Recognizer()
    
    try:
        with sr.Microphone() as source:
            logging.info("Adjusting for ambient noise...")
            recognizer.adjust_for_ambient_noise(source, duration=1)
            logging.info("Start speaking now...")
            
            audio_data = recognizer.listen(source, timeout=timeout, phrase_time_limit=phrase_time_limit)
            logging.info("Recording complete.")
            
            # Convert WAV output to compressed MP3 file
            wav_data = audio_data.get_wav_data()
            audio_segment = AudioSegment.from_wav(BytesIO(wav_data))
            audio_segment.export(file_path, format="mp3", bitrate="128k")
            logging.info(f"Audio saved to {file_path}")

    except Exception as e:
        logging.error(f"An error occurred during audio recording: {e}")

def transcribe_with_groq(stt_model: str, audio_filepath: str, GROQ_API_KEY: str) -> str:
    """
    Transcribes an audio file into text using the Groq Whisper STT API.
    """
    if not os.path.exists(audio_filepath):
        logging.error(f"Audio file not found at: {audio_filepath}")
        return ""

    client = Groq(api_key=GROQ_API_KEY)
    try:
        audio_file_size = os.path.getsize(audio_filepath)
        logging.info(f"Attempting to transcribe audio file: {audio_filepath}, size: {audio_file_size} bytes")
        
        # Safely open file using with-statement
        with open(audio_filepath, "rb") as audio_file:
            transcription = client.audio.transcriptions.create(
                model=stt_model,
                file=audio_file,
                language="en"
            )
        return transcription.text
    except Exception as e:
        logging.error(f"Error during transcription with Groq API: {e}")
        return ""
