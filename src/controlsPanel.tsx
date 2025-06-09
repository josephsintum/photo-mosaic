type controlProps = {
  image: Function;
  setImage: Function;
  mosaicSize: Function;
  setMosaicSize: Function;
  spacing: Function;
  setSpacing: Function;
  shape: Function;
  setShape: Function;
};

function ControlsPanel(props: controlProps) {
  const {
    image,
    mosaicSize,
    setMosaicSize,
    spacing,
    setSpacing,
    shape,
    setShape,
  } = props;

  return (
    <div class={`controls-panel ${image() ? 'visible' : ''}`}>
      <div class="control-group">
        <label class="control-label">Mosaic Size</label>
        <div class="control-row">
          <input
            type="range"
            class="slider"
            min="4"
            max="50"
            value={mosaicSize()}
            onInput={e => setMosaicSize(parseInt(e.target.value))}
          />
          <span class="value-display">{mosaicSize()}</span>
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
            value={spacing()}
            onInput={e => setSpacing(parseInt(e.target.value))}
          />
          <span class="value-display">{spacing()}</span>
        </div>
      </div>

      <div class="control-group">
        <label class="control-label">Shape</label>
        <div class="shape-toggles">
          <button
            class={`shape-btn ${shape() === 'square' ? 'active' : ''}`}
            onClick={() => setShape('square')}
          >
            Square
          </button>
          <button
            class={`shape-btn ${shape() === 'circle' ? 'active' : ''}`}
            onClick={() => setShape('circle')}
          >
            Circle
          </button>
        </div>
      </div>
    </div>
  );
}

export default ControlsPanel;
