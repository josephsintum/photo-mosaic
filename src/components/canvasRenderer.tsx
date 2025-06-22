import { Button } from '@/components/ui/button.tsx';
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
  }, [imageData, settings]);

  const handleDownload = () => {
    const canvas = document.getElementById(
      'mosaic-canvas',
    ) as HTMLCanvasElement;
    if (!canvas) return;

    canvas.toBlob(blob => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mosaic.png'; // or 'mosaic.jpg'
      a.click();
      URL.revokeObjectURL(url); // Cleanup
    }, 'image/png'); // Can change to 'image/jpeg'
  };

  return (
    <div className="canvas-container">
      <div className="canvas-wrapper">
        <canvas ref={canvasRef} id="mosaic-canvas" />
      </div>
      {processing ? (
        <p className="processing">Processing mosaic...</p>
      ) : (
        <Button variant="outline" className="ml-auto" onClick={handleDownload}>
          Download
        </Button>
      )}
    </div>
  );
};

export default CanvasRenderer;
