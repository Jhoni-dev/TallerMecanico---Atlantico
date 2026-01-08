// src/components/checklist/ItemManager.tsx

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Trash2,
  CheckCircle2,
  CheckSquare,
} from "lucide-react";
import { ChecklistItem, ITEM_CATEGORIES, CONDITIONS } from "@/app/frontend/types/checklist.types";

interface ItemManagerProps {
  items: ChecklistItem[];
  newItem: ChecklistItem;
  onNewItemChange: (item: ChecklistItem) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  disabled?: boolean;
}

export default function ItemManager({
  items,
  newItem,
  onNewItemChange,
  onAddItem,
  onRemoveItem,
  disabled = false,
}: ItemManagerProps) {
  return (
    <div className="space-y-4">
      {/* Formulario para agregar items */}
      <div className="p-4 bg-muted dark:bg-gray-800 border dark:border-gray-700 rounded-lg space-y-3">
        <h4 className="font-semibold text-sm">Agregar Nuevo Item</h4>

        <Input
          placeholder="Nombre del item (Ej: Luces delanteras)"
          value={newItem.label}
          onChange={(e) =>
            onNewItemChange({ ...newItem, label: e.target.value })
          }
          disabled={disabled}
          className="text-sm dark:bg-gray-900 dark:border-gray-700"
        />

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Categoría</Label>
            <Select
              value={newItem.category}
              onValueChange={(value) =>
                onNewItemChange({ ...newItem, category: value })
              }
              disabled={disabled}
            >
              <SelectTrigger className="text-sm dark:bg-gray-900 dark:border-gray-700">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                {ITEM_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat} className="text-sm">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Condición</Label>
            <Select
              value={newItem.condition}
              onValueChange={(value) =>
                onNewItemChange({ ...newItem, condition: value })
              }
              disabled={disabled}
            >
              <SelectTrigger className="text-sm dark:bg-gray-900 dark:border-gray-700">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                {CONDITIONS.map((cond) => (
                  <SelectItem key={cond} value={cond} className="text-sm">
                    {cond}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center space-x-2 p-2 bg-background dark:bg-gray-900 rounded">
          <Checkbox
            id="itemChecked"
            checked={newItem.checked}
            onCheckedChange={(checked) =>
              onNewItemChange({ ...newItem, checked: !!checked })
            }
            disabled={disabled}
          />
          <Label htmlFor="itemChecked" className="text-sm cursor-pointer">
            Marcar como verificado
          </Label>
        </div>

        <Input
          placeholder="Notas adicionales (opcional)"
          value={newItem.notes}
          onChange={(e) =>
            onNewItemChange({ ...newItem, notes: e.target.value })
          }
          disabled={disabled}
          className="text-sm dark:bg-gray-900 dark:border-gray-700"
        />

        <Button
          onClick={onAddItem}
          className="w-full"
          variant="default"
          disabled={!newItem.label || !newItem.category || disabled}
        >
          <Plus className="mr-2 h-4 w-4" />
          Agregar Item
        </Button>
      </div>

      {/* Lista de items agregados */}
      {items.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">Items Agregados</h4>
            <Badge variant="secondary" className="text-sm dark:bg-gray-700">
              {items.length}
            </Badge>
          </div>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex items-start justify-between p-3 bg-card dark:bg-gray-800 border dark:border-gray-700 rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {item.checked ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-muted-foreground flex-shrink-0" />
                    )}
                    <span className="font-medium text-sm truncate">
                      {item.label}
                    </span>
                  </div>
                  <div className="ml-7 mt-1 space-y-1">
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="outline"
                        className="text-xs dark:bg-gray-700"
                      >
                        {item.category}
                      </Badge>
                      {item.condition && (
                        <Badge
                          variant="outline"
                          className="text-xs dark:bg-gray-700"
                        >
                          {item.condition}
                        </Badge>
                      )}
                    </div>
                    {item.notes && (
                      <p className="text-xs text-muted-foreground">
                        {item.notes}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveItem(index)}
                  disabled={disabled}
                  className="text-red-600 dark:text-red-400 h-8 w-8 p-0 flex-shrink-0 ml-2"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed rounded-lg p-8 text-center bg-muted/50 dark:bg-gray-800/50">
          <CheckSquare className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm font-medium text-muted-foreground mb-1">
            No hay items agregados
          </p>
          <p className="text-xs text-muted-foreground">
            Usa el formulario de arriba para agregar puntos de inspección
          </p>
        </div>
      )}
    </div>
  );
}