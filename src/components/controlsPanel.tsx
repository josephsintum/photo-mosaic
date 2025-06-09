import type { Component } from 'solid-js';

export interface MosaicSettings {
  size: number;
  spacing: number;
  shape: 'square' | 'circle';
}

interface ControlsPanelProps {
  settings: MosaicSettings;
  onSettingsChange: (settings: Partial<MosaicSettings>) => void;
}

const ControlsPanel: Component<ControlsPanelProps> = props => {
  return (
    <div class="controls-panel visible">
      <div class="control-group">
        <label class="control-label">Mosaic Size</label>
        <div class="control-row">
          <input
            type="range"
            class="slider"
            min="4"
            max="50"
            value={props.settings.size}
            onInput={e =>
              props.onSettingsChange({
                size: parseInt(e.target.value),
              })
            }
          />
          <span class="value-display">{props.settings.size}</span>
        </div>
      </div>

      <div class="control-group">
        <label class="control-label">Spacing</label>
        <div class="control-row">
          <input
            type="range"
            class="slider"
            min="0"
            max="10"
            value={props.settings.spacing}
            onInput={e =>
              props.onSettingsChange({
                spacing: parseInt(e.target.value),
              })
            }
          />
          <span class="value-display">{props.settings.spacing}</span>
        </div>
      </div>

      <div class="control-group">
        <label class="control-label">Shape</label>
        <div class="shape-toggles">
          <button
            class={`shape-btn ${props.settings.shape === 'square' ? 'active' : ''}`}
            onClick={() => props.onSettingsChange({ shape: 'square' })}
          >
            Square
          </button>
          <button
            class={`shape-btn ${props.settings.shape === 'circle' ? 'active' : ''}`}
            onClick={() => props.onSettingsChange({ shape: 'circle' })}
          >
            Circle
          </button>
        </div>
      </div>
    </div>
  );
};

export default ControlsPanel;
