// src/app/components/companies/tabs/AppearanceTab.jsx
"use client";

import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { LogoUploader } from '../LogoUploader';

// Componente de input de color reutilizable
const ColorInput = ({ value, onChange, label, className }) => {
  return (
    <div className="relative">
      <input
        type="color"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="sr-only"
        id={label}
      />
      <label
        htmlFor={label}
        className="cursor-pointer flex items-center gap-2"
      >
        <div 
          className={cn(
            "w-8 h-8 rounded-md border shadow-sm",
            className
          )}
          style={{ backgroundColor: value }}
        />
        <input
          type="text"
          value={value}
          onChange={e => {
            const newValue = e.target.value;
            if (newValue.startsWith('#')) {
              onChange(newValue);
            } else {
              onChange(`#${newValue}`);
            }
          }}
          className="h-8 w-24 px-2 text-sm border rounded-md"
          maxLength={7}
        />
      </label>
    </div>
  );
};

export const AppearanceTab = () => {
  const form = useFormContext();

  const handleColorChange = (colorKey) => (value) => {
    form.setValue(`configuration.theme.${colorKey}`, value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <div className="space-y-8">
      {/* Company Logo Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Company Logo</h3>
        <LogoUploader />
      </div>

      {/* Color Settings Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Theme Colors</h3>
        
        {/* Primera fila: Primary y Secondary */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="configuration.theme.base1"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-sm">Primary Color</FormLabel>
                <FormControl>
                  <ColorInput
                    value={field.value}
                    onChange={handleColorChange("base1")}
                    label="primary-color"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="configuration.theme.base2"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-sm">Secondary Color</FormLabel>
                <FormControl>
                  <ColorInput
                    value={field.value}
                    onChange={handleColorChange("base2")}
                    label="secondary-color"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>

        {/* Segunda fila: Highlight y Call to Action */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="configuration.theme.highlighting"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-sm">Highlight Color</FormLabel>
                <FormControl>
                  <ColorInput
                    value={field.value}
                    onChange={handleColorChange("highlighting")}
                    label="highlight-color"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="configuration.theme.callToAction"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-sm">Call to Action Color</FormLabel>
                <FormControl>
                  <ColorInput
                    value={field.value}
                    onChange={handleColorChange("callToAction")}
                    label="cta-color"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};