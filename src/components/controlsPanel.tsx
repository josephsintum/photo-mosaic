import React from 'react';

export interface MosaicSettings {
	size: number;
	spacing: number;
	shape: 'square' | 'circle';
	backgroundColor: string;
	opacity: number;
}

interface ControlsPanelProps {
	settings: MosaicSettings;
	onSettingsChange: (settings: Partial<MosaicSettings>) => void;
	computedColor: string;
}

const ControlsPanel: React.FC<ControlsPanelProps> = ({
	                                                     settings,
	                                                     onSettingsChange,
	                                                     computedColor
                                                     }) => {
	return (
		<div className="controls-panel visible">
			<div className="control-group">
				<label className="control-label">Mosaic Size</label>
				<div className="control-row">
					<input
						type="range"
						className="slider"
						min="4"
						max="50"
						value={settings.size}
						onChange={(e) =>
							onSettingsChange({
								size: parseInt(e.target.value),
							})
						}
					/>
					<span className="value-display">{settings.size}</span>
				</div>
			</div>

			<div className="control-group">
				<label className="control-label">Spacing</label>
				<div className="control-row">
					<input
						type="range"
						className="slider"
						min="0"
						max="10"
						value={settings.spacing}
						onChange={(e) =>
							onSettingsChange({
								spacing: parseInt(e.target.value),
							})
						}
					/>
					<span className="value-display">{settings.spacing}</span>
				</div>
			</div>

			<div className="control-group">
				<label className="control-label">Background Color</label>
				<div className="control-row">
					<input
						type="color"
						name="head"
						value={settings.backgroundColor}
						onChange={(e) =>
							onSettingsChange({
								backgroundColor: e.target.value,
							})
						}
					/>
					<input
						type="range"
						className="slider"
						min="0"
						max="10"
						value={settings.opacity * 10}
						onChange={(e) =>
							onSettingsChange({
								opacity: parseInt(e.target.value) / 10,
							})
						}
					/>
					<span className="value-display">{computedColor}</span>
				</div>
			</div>

			<div className="control-group">
				<label className="control-label">Shape</label>
				<div className="shape-toggles">
					<button
						className={`shape-btn ${settings.shape === 'square' ? 'active' : ''}`}
						onClick={() => onSettingsChange({ shape: 'square' })}
					>
						Square
					</button>
					<button
						className={`shape-btn ${settings.shape === 'circle' ? 'active' : ''}`}
						onClick={() => onSettingsChange({ shape: 'circle' })}
					>
						Circle
					</button>
				</div>
			</div>
		</div>
	);
};

export default ControlsPanel;