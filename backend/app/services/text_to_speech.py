import os
import platform
import subprocess
from gtts import gTTS
from pydub import AudioSegment

def text_to_speech_with_gtts(input_text: str, output_filepath: str, autoplay: bool = True) -> str:
    """
    Converts text to speech using gTTS and optionally plays it automatically based on OS.
    For Windows, it converts the MP3 to WAV for compatibility with Media.SoundPlayer.
    """
    language = "en"
    audio_obj = gTTS(
        text=input_text,
        lang=language,
        slow=False
    )
    audio_obj.save(output_filepath)
    
    if not autoplay:
        return output_filepath

    os_name = platform.system()
    try:
        if os_name == "Darwin":  # macOS
            subprocess.run(['afplay', output_filepath])
        elif os_name == "Windows":  # Windows
            # Convert MP3 to WAV for Windows Media.SoundPlayer to ensure playback
            wav_filepath = output_filepath.replace(".mp3", ".wav")
            AudioSegment.from_mp3(output_filepath).export(wav_filepath, format="wav")
            subprocess.run(['powershell', '-c', f'(New-Object Media.SoundPlayer "{wav_filepath}").PlaySync();'])
        elif os_name == "Linux":  # Linux
            subprocess.run(['aplay', output_filepath])
        else:
            raise OSError("Unsupported operating system for audio playback")
    except Exception as e:
        print(f"An error occurred while trying to play the audio: {e}")
    return output_filepath
