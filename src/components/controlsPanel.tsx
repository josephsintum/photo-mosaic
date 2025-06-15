import { ColorPickerPopover } from '@/components/colorPickerPopover.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Slider } from '@/components/ui/slider';
import React from 'react';

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

const ControlsPanel: React.FC<ControlsPanelProps> = ({
  settings,
  onSettingsChange,
}) => {
  return (
    <div className="visible flex flex-col gap-y-4 rounded-2xl bg-white p-8">
      <div className="space-y-1">
        <Label>Mosaic Size</Label>
        <div className="flex items-center space-x-4">
          <Slider
            min={4}
            max={50}
            step={1}
            value={[settings.size]}
            onValueChange={value =>
              onSettingsChange({
                size: value[0],
              })
            }
          />
          <span className="font-bold">{settings.size}</span>
        </div>
      </div>

      <div className="space-y-1">
        <Label>Spacing</Label>
        <div className="flex items-center space-x-4">
          <Slider
            min={0}
            max={10}
            step={1}
            value={[settings.spacing]}
            onValueChange={value =>
              onSettingsChange({
                spacing: value[0],
              })
            }
          />
          <span className="font-bold">{settings.spacing}</span>
        </div>
      </div>

      <div className="space-y-1">
        <Label>Background Color</Label>
        <div className="flex items-center space-x-4">
          <ColorPickerPopover
            color={settings.color}
            onChange={newColor => onSettingsChange({ color: newColor })}
          />
          <span className="font-bold">{settings.color}</span>
        </div>
      </div>

      <div className="space-y-1">
        <Label>Shape</Label>
        <div className="flex gap-2">
          <Button
            variant={`${settings.shape === 'square' ? 'default' : 'secondary'}`}
            onClick={() => onSettingsChange({ shape: 'square' })}
          >
            Square
          </Button>
          <Button
            variant={`${settings.shape === 'circle' ? 'default' : 'secondary'}`}
            onClick={() => onSettingsChange({ shape: 'circle' })}
          >
            Circle
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ControlsPanel;
