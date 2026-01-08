// src/components/checklist/VehicleEvaluation.tsx

import { Badge } from "@/components/ui/badge";
import { Settings, AlertCircle, AlertTriangle } from "lucide-react";
import { ChecklistItem } from "@/app/frontend/types/checklist.types";
import { evaluateVehicleCondition } from "@/app/frontend/utils/checklist.utils";

interface VehicleEvaluationProps {
  items: ChecklistItem[];
}

export default function VehicleEvaluation({ items }: VehicleEvaluationProps) {
  const evaluation = evaluateVehicleCondition(items);

  const colorClasses = {
    green: {
      bg: "bg-green-50 dark:bg-green-950/30",
      border: "border-green-200 dark:border-green-900",
      text: "text-green-900 dark:text-green-200",
      badge: "bg-green-500 dark:bg-green-600",
      label: "text-green-700 dark:text-green-400",
    },
    lime: {
      bg: "bg-lime-50 dark:bg-lime-950/30",
      border: "border-lime-200 dark:border-lime-900",
      text: "text-lime-900 dark:text-lime-200",
      badge: "bg-lime-500 dark:bg-lime-600",
      label: "text-lime-700 dark:text-lime-400",
    },
    blue: {
      bg: "bg-blue-50 dark:bg-blue-950/30",
      border: "border-blue-200 dark:border-blue-900",
      text: "text-blue-900 dark:text-blue-200",
      badge: "bg-blue-500 dark:bg-blue-600",
      label: "text-blue-700 dark:text-blue-400",
    },
    amber: {
      bg: "bg-amber-50 dark:bg-amber-950/30",
      border: "border-amber-200 dark:border-amber-900",
      text: "text-amber-900 dark:text-amber-200",
      badge: "bg-amber-500 dark:bg-amber-600",
      label: "text-amber-700 dark:text-amber-400",
    },
    orange: {
      bg: "bg-orange-50 dark:bg-orange-950/30",
      border: "border-orange-200 dark:border-orange-900",
      text: "text-orange-900 dark:text-orange-200",
      badge: "bg-orange-500 dark:bg-orange-600",
      label: "text-orange-700 dark:text-orange-400",
    },
    red: {
      bg: "bg-red-50 dark:bg-red-950/30",
      border: "border-red-200 dark:border-red-900",
      text: "text-red-900 dark:text-red-200",
      badge: "bg-red-500 dark:bg-red-600",
      label: "text-red-700 dark:text-red-400",
    },
    gray: {
      bg: "bg-muted dark:bg-gray-800",
      border: "border-border dark:border-gray-700",
      text: "text-foreground",
      badge: "bg-muted-foreground",
      label: "text-muted-foreground",
    },
  };

  const colors =
    colorClasses[evaluation.color as keyof typeof colorClasses];

  return (
    <div className={`p-4 ${colors.bg} ${colors.border} border rounded-lg`}>
      <div className="flex items-center justify-between mb-4">
        <h3
          className={`font-semibold text-lg ${colors.text} flex items-center gap-2`}
        >
          <Settings className="h-5 w-5" />
          Estado General del Vehículo
        </h3>
        <Badge className={`${colors.badge} text-white`}>
          {evaluation.status}
        </Badge>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm ${colors.label} font-medium`}>
            Puntuación General
          </span>
          <span className={`text-2xl font-bold ${colors.text}`}>
            {evaluation.percentage}%
          </span>
        </div>
        <div className="w-full bg-muted dark:bg-gray-800 rounded-full h-3">
          <div
            className={`${colors.badge} h-3 rounded-full transition-all`}
            style={{ width: `${evaluation.percentage}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
        {evaluation.details.excelente > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full bg-green-500 dark:bg-green-600" />
            <span className="text-foreground">
              <span className="font-semibold">
                {evaluation.details.excelente}
              </span>{" "}
              Excelente
            </span>
          </div>
        )}
        {evaluation.details.bueno > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full bg-blue-500 dark:bg-blue-600" />
            <span className="text-foreground">
              <span className="font-semibold">{evaluation.details.bueno}</span>{" "}
              Bueno
            </span>
          </div>
        )}
        {evaluation.details.regular > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full bg-yellow-500 dark:bg-yellow-600" />
            <span className="text-foreground">
              <span className="font-semibold">
                {evaluation.details.regular}
              </span>{" "}
              Regular
            </span>
          </div>
        )}
        {evaluation.details.malo > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full bg-orange-500 dark:bg-orange-600" />
            <span className="text-foreground">
              <span className="font-semibold">{evaluation.details.malo}</span>{" "}
              Malo
            </span>
          </div>
        )}
        {evaluation.details.requiereAtencion > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full bg-red-500 dark:bg-red-600" />
            <span className="text-foreground">
              <span className="font-semibold">
                {evaluation.details.requiereAtencion}
              </span>{" "}
              Urgente
            </span>
          </div>
        )}
      </div>

      <div
        className={`p-3 ${colors.bg} border ${colors.border} rounded-lg text-sm ${colors.text}`}
      >
        <p className="font-semibold mb-1 flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          Recomendación:
        </p>
        <p>{evaluation.recommendation}</p>
      </div>

      {evaluation.details.requiereAtencion > 0 && (
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg">
          <p className="text-sm font-semibold text-red-900 dark:text-red-200 mb-2 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Items que Requieren Atención Urgente:
          </p>
          <ul className="text-sm text-red-800 dark:text-red-300 space-y-1 list-disc list-inside">
            {items
              .filter((item) => item.condition === "Requiere Atención")
              .map((item) => (
                <li key={item.id}>
                  <span className="font-medium">{item.label}</span>
                  {item.notes && (
                    <span className="text-red-700 dark:text-red-400">
                      {" "}
                      - {item.notes}
                    </span>
                  )}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}