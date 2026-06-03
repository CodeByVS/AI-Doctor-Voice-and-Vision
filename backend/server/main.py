import os
import sys
import shutil
import base64
import uuid
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

# Adjust path dynamically to ensure server modules can be loaded from anywhere
app_dir = os.path.dirname(os.path.abspath(__file__))  # backend/server
backend_dir = os.path.dirname(app_dir)                # backend
root_dir = os.path.dirname(backend_dir)                # root workspace

if backend_dir not in sys.path:
    sys.path.append(backend_dir)
if root_dir not in sys.path:
    sys.path.append(root_dir)

# Import configurations & services using absolute modular paths
from server.core.config import TEMP_DIR, DIST_DIR, ALLOWED_SAMPLE_FILES, ROOT_DIR
from server.core.prompts import SYSTEM_PROMPT
from server.services.doctor_brain import analyze_image_with_query
from server.services.speech_to_text import transcribe_with_groq
from server.services.text_to_speech import text_to_speech_with_gtts
from server.utils.helpers import encode_image, cleanup_files

app = FastAPI(title="AI Doctor Portal", description="Web application for Voice & Vision AI Doctor")

# Enable CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/analyze")
async def analyze(
    image: UploadFile = File(None),
    audio: UploadFile = File(None),
    text_query: str = Form(None),
    model: str = Form("meta-llama/llama-4-scout-17b-16e-instruct")
):
    session_id = str(uuid.uuid4())
    image_path = None
    audio_path = None
    output_audio_path = None
    transcription = ""

    # 1. Process User Audio (Speech-to-Text)
    if audio:
        ext = os.path.splitext(audio.filename)[1] or ".webm"
        audio_path = os.path.join(TEMP_DIR, f"{session_id}_input{ext}")
        with open(audio_path, "wb") as buffer:
            shutil.copyfileobj(audio.file, buffer)
        
        # Transcribe with Groq API
        api_key = os.environ.get("GROQ_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="GROQ_API_KEY not configured on server.")
        
        transcription = transcribe_with_groq(
            stt_model="whisper-large-v3",
            audio_filepath=audio_path,
            GROQ_API_KEY=api_key
        )
        if not transcription:
            transcription = "[Could not transcribe user audio]"
    elif text_query:
        transcription = text_query
    else:
        transcription = "Please examine this image and provide a general diagnosis."

    # 2. Process User Image
    encoded_image = None
    if image:
        ext = os.path.splitext(image.filename)[1] or ".jpg"
        image_path = os.path.join(TEMP_DIR, f"{session_id}_input{ext}")
        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        
        try:
            encoded_image = encode_image(image_path)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to encode image: {str(e)}")

    # 3. Call AI Doctor Brain
    patient_query = f"Patient Query: {transcription}" if transcription else "Please examine this image and provide a general diagnosis."
    try:
        doctor_response = analyze_image_with_query(
            system_prompt=SYSTEM_PROMPT,
            user_query=patient_query,
            model=model,
            encoded_image=encoded_image
        )
    except Exception as e:
        doctor_response = f"I apologize, but I encountered an error checking my medical database: {str(e)}"

    # 4. Generate Doctor Voice (Text-to-Speech using gTTS)
    audio_response_b64 = None
    if doctor_response:
        output_audio_filename = f"{session_id}_output.mp3"
        output_audio_path = os.path.join(TEMP_DIR, output_audio_filename)
        
        try:
            text_to_speech_with_gtts(
                input_text=doctor_response,
                output_filepath=output_audio_path,
                autoplay=False
            )
            
            # Read and encode output audio file
            if os.path.exists(output_audio_path):
                with open(output_audio_path, "rb") as f:
                    audio_response_b64 = base64.b64encode(f.read()).decode("utf-8")
        except Exception as e:
            # Log error and continue without voice
            print(f"TTS generation failed: {e}")

    # Cleanup temporary files
    cleanup_files(image_path, audio_path, output_audio_path)

    return {
        "transcription": transcription,
        "response": doctor_response,
        "audio": audio_response_b64,
        "audio_type": "audio/mp3"
    }

@app.get("/api/samples/{filename}")
async def get_sample_image(filename: str):
    safe_filename = os.path.basename(filename)
    file_path = os.path.join(ROOT_DIR, safe_filename)
    
    if safe_filename in ALLOWED_SAMPLE_FILES and os.path.exists(file_path):
        return FileResponse(file_path)
    raise HTTPException(status_code=404, detail="Sample file not found.")

# Serve React frontend build files
if os.path.exists(DIST_DIR):
    app.mount("/", StaticFiles(directory=DIST_DIR, html=True), name="frontend")
else:
    @app.get("/")
    async def read_index():
        return HTMLResponse("<h2>Frontend build not found. Please run 'pnpm run build' inside 'frontend' folder.</h2>")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
