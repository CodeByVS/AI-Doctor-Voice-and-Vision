import os
import logging
from io import BytesIO
from pydub import AudioSegment
from groq import Groq

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Configure pydub FFMPEG path if provided in environment variables
if os.environ.get("FFMPEG_PATH"):
    AudioSegment.converter = os.environ.get("FFMPEG_PATH")

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
