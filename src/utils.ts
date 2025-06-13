export function hexToRGBA(hex: string, opacity: number) {
  if (opacity < 0) opacity = 0;
  else if (opacity > 255) opacity = 255;

  hex = hex.replace('#', '');

  // Handle shorthand hex (e.g., #abc)
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  // Parse the hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Return RGB string
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
