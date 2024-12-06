// src/app/components/companies/tabs/StagesTab.jsx
"use client";

import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const DEFAULT_STAGES = [
  { name: "Prospecting", show: true },
  { name: "Qualification", show: true },
  { name: "Need Analysis", show: true },
  { name: "Demo", show: true },
  { name: "Proposal Sent", show: true },
  { name: "Negotiation", show: true },
  { name: "Closed Won", show: true },
  { name: "Closed Lost", show: true },
  { name: "Follow Up", show: true },
];

export const StagesTab = () => {
  const form = useFormContext();
  const [isResetting, setIsResetting] = useState(false);

  // Función para restablecer a los valores por defecto
  const handleReset = () => {
    setIsResetting(true);
    const formattedStages = DEFAULT_STAGES.map((stage, index) => ({
      ...stage,
      order: index + 1,
    }));
    form.setValue("configuration.stages", formattedStages, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setIsResetting(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Customize Sales Funnel Stages</h3>
        <Button 
          variant="secondary" 
          size="sm"
          onClick={handleReset}
          disabled={isResetting}
        >
          Reset to Default
        </Button>
      </div>

      <FormField
        control={form.control}
        name="configuration.stages"
        render={({ field }) => (
          <FormItem className="space-y-4">
            {field.value?.map((stage, index) => (
              <div 
                key={index}
                className="flex items-center gap-4 p-3 bg-white rounded-lg border"
              >
                <div className="flex-1">
                  <Input
                    value={stage.name}
                    onChange={(e) => {
                      const newStages = [...field.value];
                      newStages[index] = {
                        ...stage,
                        name: e.target.value,
                      };
                      form.setValue("configuration.stages", newStages, {
                        shouldValidate: true,
                      });
                    }}
                    className="h-8 text-sm"
                    placeholder="Stage name"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={stage.show}
                    onCheckedChange={(checked) => {
                      const newStages = [...field.value];
                      newStages[index] = {
                        ...stage,
                        show: checked,
                      };
                      form.setValue("configuration.stages", newStages, {
                        shouldValidate: true,
                      });
                    }}
                  />
                  <span className="text-sm">Show</span>
                </div>
              </div>
            ))}
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="text-xs text-muted-foreground">
        Note: The order of stages is determined by their position in the list
      </div>
    </div>
  );
};