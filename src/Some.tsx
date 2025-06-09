import { createSignal } from 'solid-js';
import ControlsPanel from './controlsPanel.tsx';
import Mosaic from './mosaic.tsx';
import Uploader from './uploader.tsx';

function ImageMosaicApp() {
  const [image, setImage] = createSignal<string | null>(null);
  const [mosaicSize, setMosaicSize] = createSignal(8);
  const [spacing, setSpacing] = createSignal(1);
  const [shape, setShape] = createSignal('square');

  // Reactive effect for mosaic processing

  return (
    <div class="container">
      <div class="header">
        <h1>Image Mosaic Generator</h1>
        <p>Upload an image and create beautiful mosaic effects</p>
      </div>

      <Uploader setImage={setImage} />

      <ControlsPanel
        image={image}
        setImage={setImage}
        mosaicSize={mosaicSize}
        setMosaicSize={setMosaicSize}
        spacing={spacing}
        setSpacing={setSpacing}
        shape={shape}
        setShape={setShape}
      />

      <Mosaic
        image={image}
        mosaicSize={mosaicSize}
        shape={shape}
        spacing={spacing}
      />
    </div>
  );
}

export default ImageMosaicApp;
