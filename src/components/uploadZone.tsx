import React, { useCallback, useRef, useState } from 'react';

export interface ImageData {
  file: File;
  image: HTMLImageElement;
  width: number;
  height: number;
}

interface UploadZoneProps {
  onImageUpload: (data: ImageData) => void;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onImageUpload }) => {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    async (file: File): Promise<void> => {
      if (!file.type.startsWith('image/')) return;

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => {
          const img = new Image();
          img.onload = () => {
            const imageData: ImageData = {
              file,
              image: img,
              width: img.width,
              height: img.height,
            };
            onImageUpload(imageData);
            resolve();
          };
          img.onerror = reject;
          img.src = e.target?.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    },
    [onImageUpload],
  );

  const handleFileSelect = useCallback(
    (file: File) => {
      processFile(file).catch(console.error);
    },
    [processFile],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect],
  );

  return (
    <div
      className={
        'cursor-pointer rounded-2xl bg-white p-8 text-center shadow-xl hover:bg-white'
      }
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div
        className={`rounded-2xl border-4 border-dashed border-gray-300 p-8 transition-all duration-300 ease-in-out hover:border-purple-100 ${dragOver ? 'scale-[1.02] border-purple-300 bg-purple-200' : ''}`}
      >
        <div className="mb-4 text-5xl">🌁</div>
        <div className="text-xl font-bold">Drop your image here, or browse</div>
        <span className="text-sm font-light text-gray-400">
          Supports JPG, PNG, GIF formats
        </span>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default UploadZone;
