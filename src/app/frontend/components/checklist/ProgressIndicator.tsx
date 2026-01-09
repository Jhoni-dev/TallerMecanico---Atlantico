// src/components/checklist/ProgressIndicator.tsx

import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export default function ProgressIndicator({
  currentStep,
  totalSteps,
  stepLabels,
}: ProgressIndicatorProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Progreso</h3>
        <Badge variant="outline" className="text-sm">
          Paso {currentStep} de {totalSteps}
        </Badge>
      </div>

      {/* Pasos con líneas integradas */}
      <div className="mb-4">
        <div className="flex items-center">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 font-semibold text-sm transition-all ${
                  step < currentStep
                    ? "bg-primary border-primary text-primary-foreground"
                    : step === currentStep
                      ? "bg-primary border-primary text-primary-foreground ring-4 ring-primary/20"
                      : "bg-background border-muted-foreground/30 text-muted-foreground"
                }`}
              >
                {step < currentStep ? <Check className="h-4 w-4" /> : step}
              </div>
              {step < totalSteps && (
                <div
                  className={`flex-1 h-1 mx-2 rounded transition-all ${
                    step < currentStep ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Labels de pasos */}
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${totalSteps}, 1fr)` }}>
        {stepLabels.map((label, index) => (
          <div
            key={index}
            className="text-center"
          >
            <span
              className={`text-xs transition-all ${
                currentStep === index + 1 
                  ? "font-semibold text-foreground" 
                  : "text-muted-foreground"
              }`}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}