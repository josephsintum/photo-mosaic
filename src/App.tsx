import React, { useCallback, useState } from 'react';
import CanvasRenderer from './components/canvasRenderer.tsx';
import ControlsPanel, {
  type MosaicSettings,
} from './components/controlsPanel.tsx';
import type { ImageData } from './components/uploadZone.tsx';
import UploadZone from './components/uploadZone.tsx';

const App: React.FC = () => {
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [settings, setSettings] = useState<MosaicSettings>({
    size: 8,
    spacing: 1,
    shape: 'square',
    color: 'rgba(255, 255, 255, 1)',
  });

  const handleImageUpload = useCallback((data: ImageData) => {
    setImageData(data);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<MosaicSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  return (
    <div className="max-w-4xl space-y-4 p-8">
      <header className="mb-4 space-y-1 text-gray-100">
        <h1 className="text-4xl font-bold">Image Mosaic Generator</h1>
        <p className="font-light">
          Upload an image and create beautiful mosaic effects.{' '}
          <a
            className="inline-block font-light underline"
            href="https://github.com/josephsintum/photo-mosaic"
          >
            Source Code - Github
          </a>
        </p>
      </header>

      {imageData && (
        <>
          <ControlsPanel
            settings={settings}
            onSettingsChange={updateSettings}
          />
          <CanvasRenderer imageData={imageData} settings={settings} />
        </>
      )}

      <UploadZone onImageUpload={handleImageUpload} />
    </div>
  );
};

export default App;
