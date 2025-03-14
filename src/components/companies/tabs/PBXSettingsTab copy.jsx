// src/app/components/companies/tabs/PBXSettingsTab.jsx
"use client";

import { useFormContext } from "react-hook-form";
import { usePbxDomains } from "@/hooks/use-pbx-domains";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

export const PBXSettingsTab = () => {
  const form = useFormContext();
  const { domains, isLoading, error } = usePbxDomains();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="h-6 w-6 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-500 py-6">
        Failed to load PBX domains. Please try again.
      </div>
    );
  }

  // Get the currently selected domain for preview
  const selectedDomain = form.watch("pbxUrl");

  return (
    <div className="space-y-4">
      {/* Domain Selector */}
      <FormField
        control={form.control}
        name="pbxUrl"
        render={({ field }) => (
          <FormItem className="space-y-1">
            <FormLabel className="text-sm">PBX Domain</FormLabel>
            <Select
              onValueChange={(domainUuid) => {
                const domain = domains.find(d => d.value.domain_uuid === domainUuid);
                field.onChange(domain?.value || null);
              }}
              value={field.value?.domain_uuid || ""}
            >
              <FormControl>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Select a PBX domain" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {domains.map((domain) => (
                  <SelectItem 
                    key={domain.value.domain_uuid} 
                    value={domain.value.domain_uuid}
                    className="text-sm"
                  >
                    {domain.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      {/* Domain Preview */}
      {selectedDomain && (
        <Card className="bg-muted/50">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Domain Status</span>
              <Badge 
                variant={selectedDomain.domain_enabled ? "default" : "secondary"}
              >
                {selectedDomain.domain_enabled ? "Enabled" : "Disabled"}
              </Badge>
            </div>

            {selectedDomain.domain_description && (
              <div className="space-y-1">
                <span className="text-sm font-medium">Description</span>
                <p className="text-sm text-muted-foreground">
                  {selectedDomain.domain_description}
                </p>
              </div>
            )}

            <div className="space-y-1">
              <span className="text-sm font-medium">Technical Details</span>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div>
                  <span className="font-medium">UUID:</span>
                  <br />
                  {selectedDomain.domain_uuid}
                </div>
                <div>
                  <span className="font-medium">Created:</span>
                  <br />
                  {selectedDomain.insert_date ? 
                    new Date(selectedDomain.insert_date).toLocaleDateString() : 
                    "N/A"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};