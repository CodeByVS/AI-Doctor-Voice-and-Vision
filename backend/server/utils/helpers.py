import os
import base64

def encode_image(image_path: str) -> str:
    """
    Reads an image file and encodes it to a base64 string.
    Uses a context manager to ensure the file descriptor is closed properly.
    """
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")

def cleanup_files(*filepaths):
    """
    Safely removes temporary files from the filesystem.
    """
    for path in filepaths:
        try:
            if path and os.path.exists(path):
                os.remove(path)
        except Exception as e:
            print(f"Cleanup failed for file {path}: {e}")
