import { ColorPickerPopover } from '@/components/colorPickerPopover.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Slider } from '@/components/ui/slider';
import React, { memo } from 'react';

export interface MosaicSettings {
  size: number;
  spacing: number;
  shape: 'square' | 'circle';
  color: string;
}

interface ControlsPanelProps {
  settings: MosaicSettings;
  onSettingsChange: (settings: Partial<MosaicSettings>) => void;
}

// Main controls panel component
const ControlsPanel: React.FC<ControlsPanelProps> = ({
  settings,
  onSettingsChange,
}) => {
  // Create memoized callback handlers
  const handleSizeChange = React.useCallback(
    (size: number) => onSettingsChange({ size }),
    [onSettingsChange],
  );

  const handleSpacingChange = React.useCallback(
    (spacing: number) => onSettingsChange({ spacing }),
    [onSettingsChange],
  );

  const handleColorChange = React.useCallback(
    (color: string) => onSettingsChange({ color }),
    [onSettingsChange],
  );

  const handleShapeChange = React.useCallback(
    (shape: 'square' | 'circle') => onSettingsChange({ shape }),
    [onSettingsChange],
  );

  return (
    <div className="visible flex flex-col gap-y-4 rounded-2xl bg-white p-8">
      <SizeControl size={settings.size} onChange={handleSizeChange} />
      <SpacingControl
        spacing={settings.spacing}
        onChange={handleSpacingChange}
      />
      <ColorControl color={settings.color} onChange={handleColorChange} />
      <ShapeControl shape={settings.shape} onChange={handleShapeChange} />
    </div>
  );
};

// Memoized individual control components
const SizeControl = memo(
  ({ size, onChange }: { size: number; onChange: (value: number) => void }) => (
    <div className="space-y-1">
      <Label>Mosaic Size</Label>
      <div className="flex items-center space-x-4">
        <Slider
          min={4}
          max={50}
          step={1}
          value={[size]}
          onValueChange={value => onChange(value[0])}
        />
        <span className="font-bold">{size}</span>
      </div>
    </div>
  ),
);

const SpacingControl = memo(
  ({
    spacing,
    onChange,
  }: {
    spacing: number;
    onChange: (value: number) => void;
  }) => (
    <div className="space-y-1">
      <Label>Spacing</Label>
      <div className="flex items-center space-x-4">
        <Slider
          min={0}
          max={10}
          step={1}
          value={[spacing]}
          onValueChange={value => onChange(value[0])}
        />
        <span className="font-bold">{spacing}</span>
      </div>
    </div>
  ),
);

const ColorControl = memo(
  ({
    color,
    onChange,
  }: {
    color: string;
    onChange: (value: string) => void;
  }) => (
    <div className="space-y-1">
      <Label>Background Color</Label>
      <div className="flex items-center space-x-4">
        <ColorPickerPopover color={color} onChange={onChange} />
        <span className="font-bold">{color}</span>
      </div>
    </div>
  ),
);

const ShapeControl = memo(
  ({
    shape,
    onChange,
  }: {
    shape: 'square' | 'circle';
    onChange: (value: 'square' | 'circle') => void;
  }) => (
    <div className="space-y-1">
      <Label>Shape</Label>
      <div className="flex gap-2">
        <Button
          variant={`${shape === 'square' ? 'default' : 'secondary'}`}
          onClick={() => onChange('square')}
        >
          Square
        </Button>
        <Button
          variant={`${shape === 'circle' ? 'default' : 'secondary'}`}
          onClick={() => onChange('circle')}
        >
          Circle
        </Button>
      </div>
    </div>
  ),
);

export default memo(ControlsPanel);
