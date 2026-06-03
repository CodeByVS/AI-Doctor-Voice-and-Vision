import React, { useState, useRef } from 'react';
import { Camera, X } from 'lucide-react';

interface ImageDropZoneProps {
  imagePreview: string;
  onImageSelect: (file: File) => void;
  onImageRemove: () => void;
}

export function ImageDropZone({ imagePreview, onImageSelect, onImageRemove }: ImageDropZoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onImageSelect(file);
      } else {
        alert('Please drop an image file.');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onImageSelect(e.target.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="upload-container">
      <label className="section-label">Medical Case Photo</label>
      <div 
        className={`drop-zone ${dragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          accept="image/*" 
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        
        {!imagePreview ? (
          <div className="drop-zone-prompt">
            <Camera className="upload-icon" strokeWidth={1.5} />
            <span className="prompt-text">Attach image case file or <em>browse</em></span>
            <span className="prompt-subtext">Supports PNG, JPG, JPEG formats</span>
          </div>
        ) : (
          <div className="preview-container">
            <img src={imagePreview} alt="Intake upload preview" />
            <button 
              className="remove-btn" 
              onClick={(e) => {
                e.stopPropagation();
                onImageRemove();
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              title="Remove image"
              type="button"
            >
              <X />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
export default ImageDropZone;
