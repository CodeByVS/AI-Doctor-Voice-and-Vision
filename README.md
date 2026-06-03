
# AI Doctor 2.0: Voice and Vision

This project provides an AI Doctor application with voice and vision capabilities.

## Setup Instructions

Follow these steps to set up and run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ai-doctor-2.0-voice-and-vision.git
cd ai-doctor-2.0-voice-and-vision
```

### 2. Create a Virtual Environment

It's highly recommended to use a virtual environment to manage dependencies.

```bash
python -m venv venv
```

### 3. Activate the Virtual Environment

**On Windows:**

```bash
.\venv\Scripts\activate
```

**On macOS/Linux:**

```bash
source venv/bin/activate
```

### 4. Install System Dependencies

This project requires `PortAudio` for `pyaudio` and `Rust` for some Python packages. If you are deploying to Hugging Face Spaces, ensure you have an `apt.txt` file with the following content:

```
portaudio19-dev
rustc
cargo
```

For local development, you might need to install these manually:

*   **PortAudio:**
    *   **Windows:** You can use Chocolatey: `choco install portaudio` or download pre-compiled binaries and add them to your system's PATH.
    *   **macOS:** `brew install portaudio`
    *   **Linux (Debian/Ubuntu):** `sudo apt-get install portaudio19-dev`

*   **Rust:** Follow the instructions on the official Rust website: <mcurl name="rustup.rs" url="https://rustup.rs/"></mcurl>

### 5. Install Python Dependencies

Install the required Python packages using pip:

```bash
pip install -r requirements.txt
```

### 6. Run the Application

```bash
python app.py
```

This will start the Gradio application. You can access it in your web browser at the address provided in the console output (usually `http://127.0.0.1:7860`).

## Project Structure

*   `app.py`: The main application file.
*   `requirements.txt`: Lists Python dependencies.
*   `Pipfile`: Project dependency management file (used with Pipenv).
*   `Pipfile.lock`: Locks exact versions of dependencies (used with Pipenv).
*   `.env`: Environment variables for local configuration.

*   `brain_of_the_doctor.py`: Contains the logic for the AI doctor's "brain."
*   `voice_of_the_doctor.py`: Handles the AI doctor's voice output.
*   `voice_of_the_patient.py`: Processes the patient's voice input.
