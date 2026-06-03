# Multi-stage build
# 1. Build the React frontend
FROM node:20 AS frontend-builder
WORKDIR /frontend
COPY frontend/package.json frontend/pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY frontend/ ./
RUN pnpm run build

# 2. Build the Python backend
FROM python:3.10-slim
WORKDIR /app

# Install system dependencies (e.g. ffmpeg for audio manipulation)
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy built frontend assets from step 1
COPY --from=frontend-builder /frontend/dist ./frontend/dist

# Copy backend application package
COPY backend/app/ ./backend/app/

# Copy sample medical images (served by /api/samples endpoint)
COPY acne.jpg skin_rash.jpg dandruff-optimized.webp ./

# Copy Vercel API entry point (also usable as reference)
COPY api/ ./api/

# Expose port
EXPOSE 7860

# Launch FastAPI via uvicorn using the new module path
CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "7860"]
