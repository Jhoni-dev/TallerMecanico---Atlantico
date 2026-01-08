// src/components/checklist/steps/Step4Items.tsx

import { Info, AlertTriangle } from "lucide-react";
import ItemManager from "../ItemManager";
import { ChecklistItem } from "@/app/frontend/types/checklist.types";

interface Step4ItemsProps {
  items: ChecklistItem[];
  newItem: ChecklistItem;
  onNewItemChange: (item: ChecklistItem) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
}

export default function Step4Items({
  items,
  newItem,
  onNewItemChange,
  onAddItem,
  onRemoveItem,
}: Step4ItemsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg">
        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-sm text-blue-900 dark:text-blue-300">
            Paso 4: Items de Inspección (Opcional)
          </h3>
          <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
            Agrega los puntos específicos que inspeccionaste en el vehículo
          </p>
        </div>
      </div>

      <ItemManager
        items={items}
        newItem={newItem}
        onNewItemChange={onNewItemChange}
        onAddItem={onAddItem}
        onRemoveItem={onRemoveItem}
      />

      <div className="flex items-start gap-2 p-3 bg-muted dark:bg-gray-800 rounded-lg">
        <AlertTriangle className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          <strong>Nota:</strong> Los pasos 3 y 4 son opcionales. Puedes crear el
          checklist sin fotos ni items de inspección si lo deseas.
        </p>
      </div>
    </div>
  );
}
