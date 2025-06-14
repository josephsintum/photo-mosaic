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
    color: 'rgba(0, 0, 0, 0.2)',
  });

  const handleImageUpload = useCallback((data: ImageData) => {
    setImageData(data);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<MosaicSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  return (
    <div className="container">
      <header className="header">
        <h1>Image Mosaic Generator</h1>
        <p>Upload an image and create beautiful mosaic effects</p>
      </header>

      <UploadZone onImageUpload={handleImageUpload} />

      {imageData && (
        <>
          <ControlsPanel
            settings={settings}
            onSettingsChange={updateSettings}
          />
          <CanvasRenderer imageData={imageData} settings={settings} />
        </>
      )}
    </div>
  );
};

export default App;
