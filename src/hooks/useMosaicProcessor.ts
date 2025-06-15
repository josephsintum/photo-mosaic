import { useCallback } from 'react';
import type { MosaicSettings } from '../components/controlsPanel.tsx';

export const useMosaicProcessor = () => {
  const processMosaic = useCallback(
    async (
      canvas: HTMLCanvasElement,
      image: HTMLImageElement,
      settings: MosaicSettings,
    ): Promise<void> => {
      return new Promise(resolve => {
        requestAnimationFrame(() => {
          const ctx = canvas.getContext('2d');
          if (!ctx) return resolve();

          canvas.width = image.width;
          canvas.height = image.height;

          // Clear canvas
          ctx.fillStyle = settings.color;
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Create temporary canvas for pixel sampling
          const tempCanvas = document.createElement('canvas');
          const tempCtx = tempCanvas.getContext('2d');
          if (!tempCtx) return resolve();

          tempCanvas.width = image.width;
          tempCanvas.height = image.height;
          tempCtx.drawImage(image, 0, 0);

          const imageData = tempCtx.getImageData(
            0,
            0,
            image.width,
            image.height,
          );
          const pixels = imageData.data;

          // Process mosaic
          for (
            let y = 0;
            y < image.height;
            y += settings.size + settings.spacing
          ) {
            for (
              let x = 0;
              x < image.width;
              x += settings.size + settings.spacing
            ) {
              // Sample pixel color from center of mosaic tile
              const centerX = Math.min(
                x + Math.floor(settings.size / 2),
                image.width - 1,
              );
              const centerY = Math.min(
                y + Math.floor(settings.size / 2),
                image.height - 1,
              );
              const pixelIndex = (centerY * image.width + centerX) * 4;

              const r = pixels[pixelIndex];
              const g = pixels[pixelIndex + 1];
              const b = pixels[pixelIndex + 2];
              const a = pixels[pixelIndex + 3] / 255;

              ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;

              if (settings.shape === 'circle') {
                ctx.beginPath();
                ctx.arc(
                  x + settings.size / 2,
                  y + settings.size / 2,
                  settings.size / 2,
                  0,
                  Math.PI * 2,
                );
                ctx.fill();
              } else {
                ctx.fillRect(x, y, settings.size, settings.size);
              }
            }
          }

          resolve();
        });
      });
    },
    [],
  );

  return { processMosaic };
};
