// src/app/components/test/TestPbxDomains.jsx
"use client";

import { usePbxDomains } from "@/hooks/use-pbx-domains";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TestPbxDomains() {
  const { domains, isLoading, error } = usePbxDomains();

  if (isLoading) {
    return <div>Loading PBX domains...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <CardTitle>Test PBX Domains</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select a domain" />
          </SelectTrigger>
          <SelectContent>
            {domains.map((domain) => (
              <SelectItem key={domain.value.domain_uuid} value={domain.value.domain_uuid}>
                {domain.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Debug info */}
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Debug Information:</h3>
          <pre className="bg-slate-100 p-4 rounded-md text-xs overflow-auto">
            {JSON.stringify({ domains, isLoading, error }, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}