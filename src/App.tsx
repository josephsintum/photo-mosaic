import { createSignal } from 'solid-js';
import CanvasRenderer from './components/CanvasRenderer.tsx';
import ControlsPanel, {
  type MosaicSettings,
} from './components/controlsPanel.tsx';
import UploadZone from './components/uploadZone.tsx';
import './App.css';

function App() {
  const [imageData, setImageData] = createSignal<ImageData | null>(null);
  const [settings, setSettings] = createSignal<MosaicSettings>({
    size: 8,
    spacing: 1,
    shape: 'square',
  });

  const handleImageUpload = (data: ImageData) => {
    setImageData(data);
  };

  const updateSettings = (newSettings: Partial<MosaicSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <div class="container">
      <header class="header">
        <h1>Image Mosaic Generator</h1>
        <p>Upload an image and create beautiful mosaic effects</p>
      </header>

      <UploadZone onImageUpload={handleImageUpload} />

      {imageData() && (
        <>
          <ControlsPanel
            settings={settings()}
            onSettingsChange={updateSettings}
          />
          <CanvasRenderer imageData={imageData()!} settings={settings()} />
        </>
      )}
    </div>
  );
}

export default App;
