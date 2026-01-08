// src/components/checklist/FuelLevelControl.tsx

import { Label } from "@/components/ui/label";
import { getFuelColor, getFuelTextColor } from "@/app/frontend/utils/checklist.utils";

interface FuelLevelControlProps {
  fuelLevel: number;
  onChange: (level: number) => void;
  disabled?: boolean;
}

export default function FuelLevelControl({
  fuelLevel,
  onChange,
  disabled = false,
}: FuelLevelControlProps) {
  return (
    <div className="space-y-3">
      <Label htmlFor="fuelLevel" className="text-base font-semibold">
        Nivel de Combustible
      </Label>
      <div className="p-4 bg-muted dark:bg-gray-800 rounded-lg space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Nivel actual:</span>
          <span className={`text-2xl font-bold ${getFuelTextColor(fuelLevel)}`}>
            {fuelLevel}%
          </span>
        </div>

        <div className="w-full bg-background dark:bg-gray-900 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${getFuelColor(fuelLevel)}`}
            style={{ width: `${fuelLevel}%` }}
          />
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={fuelLevel}
          onChange={(e) => onChange(parseInt(e.target.value))}
          disabled={disabled}
          className="w-full cursor-pointer"
        />

        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Vacío</span>
          <span>Lleno</span>
        </div>
      </div>
    </div>
  );
}
