import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { RgbaStringColorPicker } from 'react-colorful';

export function ColorPickerPopover(props: {
  color: string;
  onChange: (newColor: string) => void;
}) {
  return (
    <>
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
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
