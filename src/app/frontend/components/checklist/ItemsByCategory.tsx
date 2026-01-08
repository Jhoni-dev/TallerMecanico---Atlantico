// src/components/checklist/ItemsByCategory.tsx

import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, CheckSquare } from "lucide-react";
import { ChecklistItem, ITEM_CATEGORIES } from "@/app/frontend/types/checklist.types";

interface ItemsByCategoryProps {
  items: ChecklistItem[];
}

export default function ItemsByCategory({ items }: ItemsByCategoryProps) {
  if (!items || items.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <CheckSquare className="h-5 w-5" />
          Items de Inspección
        </h3>
        <Badge variant="secondary">
          {items.filter((i) => i.checked).length} de {items.length} verificados
        </Badge>
      </div>

      <div className="space-y-4">
        {ITEM_CATEGORIES.map((category) => {
          const categoryItems = items.filter(
            (item) => item.category === category
          );
          if (categoryItems.length === 0) return null;

          return (
            <div key={category}>
              <h4 className="font-semibold text-sm bg-muted dark:bg-gray-800 px-3 py-2 rounded-lg mb-2">
                {category}
              </h4>
              <div className="space-y-2">
                {categoryItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 p-3 bg-card dark:bg-gray-800 border dark:border-gray-700 rounded-lg"
                  >
                    {item.checked ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{item.label}</p>
                      {item.condition && (
                        <Badge
                          variant="outline"
                          className="text-xs mt-1 dark:bg-gray-700 dark:border-gray-600"
                        >
                          {item.condition}
                        </Badge>
                      )}
                      {item.notes && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {item.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}