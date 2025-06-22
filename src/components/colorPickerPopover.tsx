import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { RgbaStringColorPicker } from 'react-colorful';
import { useDebouncyEffect } from 'use-debouncy';

export function ColorPickerPopover(props: {
  color: string;
  onChange: (newColor: string) => void;
}) {
  useDebouncyEffect(() => props.onChange(props.color), 200, [props.color]);

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <div className="flex items-center space-x-4 rounded-lg border-2 border-gray-300 p-1 shadow-md">
            <div
              style={{ backgroundColor: props.color }}
              className="h-6 w-6 rounded-sm"
            ></div>
          </div>
        </PopoverTrigger>
        <PopoverContent>
          <RgbaStringColorPicker
            color={props.color}
            onChange={props.onChange}
          />
        </PopoverContent>
      </Popover>
    </>
  );
}
