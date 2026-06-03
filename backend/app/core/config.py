import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# File paths
# __file__ is backend/app/core/config.py
CORE_DIR = os.path.dirname(os.path.abspath(__file__))
APP_DIR = os.path.dirname(CORE_DIR)          # backend/app
BACKEND_DIR = os.path.dirname(APP_DIR)       # backend
ROOT_DIR = os.path.dirname(BACKEND_DIR)      # root workspace folder

# Temporary directory for uploads & recording assets
if os.environ.get("VERCEL") or os.name != "nt":
    TEMP_DIR = "/tmp"
else:
    TEMP_DIR = os.path.join(BACKEND_DIR, "temp")

# Frontend production build distribution path
DIST_DIR = os.path.join(ROOT_DIR, "frontend", "dist")

# Sample assets allowed for client-side loading
ALLOWED_SAMPLE_FILES = ["acne.jpg", "skin_rash.jpg", "dandruff-optimized.webp"]

# Make sure directories exist
os.makedirs(TEMP_DIR, exist_ok=True)
try:
    os.makedirs(os.path.join(ROOT_DIR, "static"), exist_ok=True)
except Exception:
    pass  # Avoid crashes on read-only environments
