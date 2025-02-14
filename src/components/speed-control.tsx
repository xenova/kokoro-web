import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SpeedControlProps {
  speed: number;
  onSpeedChange: (value: number) => void;
}

export function SpeedControl({ speed, onSpeedChange }: SpeedControlProps) {
  return (
    <div className="flex items-center gap-2 w-full">
      <span className="text-sm font-medium">Speed:</span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-full">
              <Slider
                value={[speed]}
                onValueChange={([value]) => onSpeedChange(value)}
                min={0.5}
                max={2}
                step={0.1}
                className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{speed}x</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
