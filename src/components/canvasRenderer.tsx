import React, { useEffect, useRef, useState } from 'react';
import { useMosaicProcessor } from '../hooks/useMosaicProcessor';
import type { MosaicSettings } from './controlsPanel.tsx';
import type { ImageData } from './uploadZone.tsx';

interface CanvasRendererProps {
  imageData: ImageData;
  settings: MosaicSettings;
}

const CanvasRenderer: React.FC<CanvasRendererProps> = ({
  imageData,
  settings,
}) => {
  const [processing, setProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { processMosaic } = useMosaicProcessor();

  useEffect(() => {
    if (canvasRef.current && imageData) {
      setProcessing(true);

      processMosaic(canvasRef.current, imageData.image, settings).finally(
        () => {
          setProcessing(false);
        },
      );
    }
  }, [imageData, settings, processMosaic]);

  return (
    <div className="canvas-container">
      <div className="canvas-wrapper">
        <canvas ref={canvasRef} />
      </div>
      {processing && <p className="processing">Processing mosaic...</p>}
    </div>
  );
};

export default CanvasRenderer;
