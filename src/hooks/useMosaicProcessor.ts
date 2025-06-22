import { useCallback, useRef } from 'react';
import type { MosaicSettings } from '../components/controlsPanel.tsx';

// Vertex shader - simple quad covering the entire canvas
const vertexShaderSource = `
attribute vec2 a_position;
varying vec2 v_texCoord;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  // Convert from clip space (-1 to 1) to texture space (0 to 1)
  v_texCoord = vec2((a_position.x + 1.0) / 2.0, 1.0 - (a_position.y + 1.0) / 2.0);
}
`;

// Fragment shader - the magic happens here
const fragmentShaderSource = `
precision mediump float;

uniform sampler2D u_image;
uniform vec2 u_imageSize;
uniform float u_tileSize;
uniform float u_spacing;
uniform vec4 u_backgroundColor;
uniform float u_shape; // 0.0 for square, 1.0 for circle

varying vec2 v_texCoord;

void main() {
  vec2 imageCoord = v_texCoord * u_imageSize;
  
  // Calculate which tile this pixel belongs to
  vec2 tileCoord = floor(imageCoord / (u_tileSize + u_spacing));
  
  // Calculate position within the current tile
  vec2 tileStart = tileCoord * (u_tileSize + u_spacing);
  vec2 posInTile = imageCoord - tileStart;
  
  // Check if we're in the spacing area
  if (posInTile.x >= u_tileSize || posInTile.y >= u_tileSize) {
    gl_FragColor = u_backgroundColor;
    return;
  }
  
  // Sample the average color of this tile
  vec2 tileCenterUV = (tileStart + u_tileSize * 0.5) / u_imageSize;
  vec4 tileColor = texture2D(u_image, tileCenterUV);
  
  // Apply shape masking
  if (u_shape > 0.5) { // Circle
    vec2 center = vec2(u_tileSize * 0.5);
    float dist = distance(posInTile, center);
    if (dist > u_tileSize * 0.5) {
      gl_FragColor = u_backgroundColor;
      return;
    }
  }
  
  gl_FragColor = tileColor;
}
`;

interface WebGLResources {
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  locations: {
    position: number;
    image: WebGLUniformLocation | null;
    imageSize: WebGLUniformLocation | null;
    tileSize: WebGLUniformLocation | null;
    spacing: WebGLUniformLocation | null;
    backgroundColor: WebGLUniformLocation | null;
    shape: WebGLUniformLocation | null;
  };
  texture: WebGLTexture | null;
  buffer: WebGLBuffer | null;
}

export const useWebGLMosaicProcessor = () => {
  // debugger;
  const resourcesRef = useRef<WebGLResources | null>(null);

  const createShader = (
    gl: WebGLRenderingContext,
    type: number,
    source: string,
  ): WebGLShader | null => {
    const shader = gl.createShader(type);
    if (!shader) return null;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  };

  const createProgram = (gl: WebGLRenderingContext): WebGLProgram | null => {
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSource,
    );

    if (!vertexShader || !fragmentShader) return null;

    const program = gl.createProgram();
    if (!program) return null;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }

    // Clean up shaders
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    return program;
  };

  const initWebGL = (canvas: HTMLCanvasElement): WebGLResources | null => {
    // todo: fix type-casting
    const gl =
      canvas.getContext('webgl') ||
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext);
    if (!gl) {
      console.error('WebGL not supported');
      return null;
    }

    const program = createProgram(gl);
    if (!program) return null;

    // Get attribute and uniform locations
    const locations = {
      position: gl.getAttribLocation(program, 'a_position'),
      image: gl.getUniformLocation(program, 'u_image'),
      imageSize: gl.getUniformLocation(program, 'u_imageSize'),
      tileSize: gl.getUniformLocation(program, 'u_tileSize'),
      spacing: gl.getUniformLocation(program, 'u_spacing'),
      backgroundColor: gl.getUniformLocation(program, 'u_backgroundColor'),
      shape: gl.getUniformLocation(program, 'u_shape'),
    };

    // Create buffer for full-screen quad
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    // Full-screen quad vertices (clip space coordinates)
    const vertices = new Float32Array([
      -1,
      -1, // bottom left
      1,
      -1, // bottom right
      -1,
      1, // top left
      1,
      1, // top right
    ]);

    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Create texture
    const texture = gl.createTexture();

    return {
      gl,
      program,
      locations,
      texture,
      buffer,
    };
  };

  const loadImageToTexture = (
    gl: WebGLRenderingContext,
    texture: WebGLTexture,
    image: HTMLImageElement,
  ) => {
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // Upload image data
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  };

  const processMosaic = useCallback(
    async (
      canvas: HTMLCanvasElement,
      image: HTMLImageElement,
      settings: MosaicSettings,
    ): Promise<void> => {
      return new Promise(resolve => {
        // Initialize WebGL resources if needed
        if (!resourcesRef.current) {
          resourcesRef.current = initWebGL(canvas);
          if (!resourcesRef.current) {
            console.error('Failed to initialize WebGL');
            return resolve();
          }
        }

        const resources = resourcesRef.current;
        const { gl, program, locations, texture, buffer } = resources;

        if (!texture || !buffer) return resolve();

        // Set canvas size
        canvas.width = image.width;
        canvas.height = image.height;
        gl.viewport(0, 0, image.width, image.height);

        // Load image into texture
        loadImageToTexture(gl, texture, image);

        // Use shader program
        gl.useProgram(program);

        // Set up vertex attributes
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.enableVertexAttribArray(locations.position);
        gl.vertexAttribPointer(locations.position, 2, gl.FLOAT, false, 0, 0);

        // Set uniforms
        gl.uniform1i(locations.image, 0); // Use texture unit 0
        gl.uniform2f(locations.imageSize, image.width, image.height);
        gl.uniform1f(locations.tileSize, settings.size);
        gl.uniform1f(locations.spacing, settings.spacing);

        // Parse background color (RGBA format)
        const parseRGBA = (rgbaString: string) => {
          const match = rgbaString.match(/rgba?\(([^)]+)\)/);
          if (match) {
            const values = match[1].split(',').map(v => parseFloat(v.trim()));
            return {
              r: values[0] / 255,
              g: values[1] / 255,
              b: values[2] / 255,
              a: values.length > 3 ? values[3] : 1.0,
            };
          }
          // Fallback for hex colors
          const hexMatch = rgbaString.match(/^#([0-9a-f]{6})$/i);
          if (hexMatch) {
            const hex = hexMatch[1];
            return {
              r: parseInt(hex.substring(0, 2), 16) / 255,
              g: parseInt(hex.substring(2, 4), 16) / 255,
              b: parseInt(hex.substring(4, 6), 16) / 255,
              a: 1.0,
            };
          }
          // Default to white
          return { r: 1.0, g: 1.0, b: 1.0, a: 1.0 };
        };

        const bgColor = parseRGBA(settings.color);
        gl.uniform4f(
          locations.backgroundColor,
          bgColor.r,
          bgColor.g,
          bgColor.b,
          bgColor.a,
        );

        gl.uniform1f(locations.shape, settings.shape === 'circle' ? 1.0 : 0.0);

        // Bind texture
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // Draw full-screen quad
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        resolve();
      });
    },
    [],
  );

  return { processMosaic };
};
