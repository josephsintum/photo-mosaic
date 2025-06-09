import { type Component, createSignal } from 'solid-js';

interface UploadZoneProps {
  onImageUpload: (data: ImageData) => void;
}

export interface ImageData {
  file: File;
  image: HTMLImageElement;
  width: number;
  height: number;
}

const UploadZone: Component<UploadZoneProps> = props => {
  const [dragOver, setDragOver] = createSignal(false);
  let fileInputRef: HTMLInputElement | undefined;

  const processFile = async (file: File): Promise<void> => {
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
          props.onImageUpload(imageData);
          resolve();
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = (file: File) => {
    processFile(file).catch(console.error);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  return (
    <div
      class={`upload-zone ${dragOver() ? 'drag-over' : ''}`}
      onClick={() => fileInputRef?.click()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div class="upload-icon">📸</div>
      <div class="upload-text">Click to upload or drag & drop an image</div>
      <div>Supports JPG, PNG, GIF formats</div>
      <input
        ref={fileInputRef}
        type="file"
        class="upload-input"
        accept="image/*"
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
        }}
      />
    </div>
  );
};

export default UploadZone;
