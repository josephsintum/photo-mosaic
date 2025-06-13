import { type Component, createEffect, createSignal } from 'solid-js';
import { useMosaicProcessor } from '../hooks/useMosaicProcessor';
import type { MosaicSettings } from './controlsPanel.tsx';
import type { ImageData } from './uploadZone.tsx';

interface CanvasRendererProps {
  imageData: ImageData;
  settings: MosaicSettings;
  computedColor: string
}

const CanvasRenderer: Component<CanvasRendererProps> = props => {
  const [processing, setProcessing] = createSignal(false);
  let canvasRef: HTMLCanvasElement | undefined;

  const { processMosaic } = useMosaicProcessor();

  createEffect(() => {
    if (canvasRef && props.imageData) {
      setProcessing(true);

      processMosaic(canvasRef, props.imageData.image, props.settings, props.computedColor).finally(
        () => {
          setProcessing(false);
        },
      );
    }
  });

  return (
    <div class="canvas-container">
      <div class="canvas-wrapper">
        <canvas ref={canvasRef} />
      </div>
      {processing() && <p class="processing">Processing mosaic...</p>}
    </div>
  );
};

export default CanvasRenderer;
