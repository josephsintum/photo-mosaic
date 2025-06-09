import { createEffect, createSignal } from 'solid-js';

type MosaicProps = {
  image: Function;
  shape: Function;
  spacing: Function;
  mosaicSize: Function;
};

function Mosaic(props: MosaicProps) {
  const [processing, setProcessing] = createSignal(false);

  let { image, shape, spacing, mosaicSize } = props;

  let canvasRef;

  // Process mosaic effect
  const processMosaic = (img, size, gap, shapeType) => {
    if (!canvasRef || !img) return;

    setProcessing(true);

    // Use requestAnimationFrame for smooth processing
    requestAnimationFrame(() => {
      const canvas = canvasRef;
      const ctx = canvas.getContext('2d');

      canvas.width = img.width;
      canvas.height = img.height;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create temporary canvas for pixel sampling
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      tempCanvas.width = img.width;
      tempCanvas.height = img.height;
      tempCtx.drawImage(img, 0, 0);

      const imageData = tempCtx.getImageData(0, 0, img.width, img.height);
      const pixels = imageData.data;

      // Process mosaic
      for (let y = 0; y < img.height; y += size + gap) {
        for (let x = 0; x < img.width; x += size + gap) {
          // Sample pixel color from center of mosaic tile
          const centerX = Math.min(x + Math.floor(size / 2), img.width - 1);
          const centerY = Math.min(y + Math.floor(size / 2), img.height - 1);
          const pixelIndex = (centerY * img.width + centerX) * 4;

          const r = pixels[pixelIndex];
          const g = pixels[pixelIndex + 1];
          const b = pixels[pixelIndex + 2];
          const a = pixels[pixelIndex + 3] / 255;

          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;

          if (shapeType === 'circle') {
            ctx.beginPath();
            ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillRect(x, y, size, size);
          }
        }
      }

      setProcessing(false);
    });
  };

  createEffect(() => {
    const img = image();
    if (img) {
      processMosaic(img, mosaicSize(), spacing(), shape());
    }
  });

  return (
    <div
      class="canvas-container"
      style={{ display: image() ? 'block' : 'none' }}
    >
      <div class="canvas-wrapper">
        <canvas ref={canvasRef} />
      </div>
      {processing() && <p class="processing">Processing mosaic...</p>}
    </div>
  );
}

export default Mosaic;
