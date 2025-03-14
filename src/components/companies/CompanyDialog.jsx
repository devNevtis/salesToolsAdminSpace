// src/app/components/companies/CompanyDialog.jsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { companySchema } from "@/lib/validations/company-schema";
import { usePbxDomains } from "@/hooks/use-pbx-domains";
import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { BasicInfoTab } from "./tabs/BasicInfoTab";
import { PBXSettingsTab } from "./tabs/PBXSettingsTab";
import { AppearanceTab } from "./tabs/AppearanceTab";
import { StagesTab } from "./tabs/StagesTab";

const DEFAULT_THEME = {
  base1: "#224F5A", // brand.primary
  base2: "#29ABE2", // brand.secondary
  highlighting: "#66C7C3", // brand.accent
  callToAction: "#F25C05", // brand.light
  logo: "",
};

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

export const CompanyDialog = ({
  open,
  onOpenChange,
  initialData,
  onSubmit,
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(companySchema),
    defaultValues: {
      ...(initialData || {
        name: "",
        phone: "",
        email: "",
        website: "",
        address: "",
        city: "",
        description: "",
        state: "",
        postalCode: "",
        country: "",
        pbxUrl: null,
        configuration: {
          theme: DEFAULT_THEME,
          stages: DEFAULT_STAGES.map((stage, index) => ({
            ...stage,
            order: index + 1,
          })),
        },
      }),
    },
  });

  const {
    formState: { errors },
  } = form;

  const getTabErrors = (tabName) => {
    switch (tabName) {
      case "basic":
        return !!(
          errors.name ||
          errors.phone ||
          errors.email ||
          errors.website ||
          errors.address ||
          errors.city ||
          errors.state ||
          errors.postalCode ||
          errors.country ||
          errors.description
        );
      case "pbx":
        return !!errors.pbxUrl;
      case "appearance":
        return errors.configuration?.theme;
      case "stages":
        return errors.configuration?.stages;
      default:
        return false;
    }
  };

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      onOpenChange(false);
      toast({
        description: initialData
          ? "Company updated successfully"
          : "Company created successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[80vh] p-0 flex flex-col">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>
            {initialData ? "Edit Company" : "Create Company"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col h-full"
          >
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex-1 flex flex-col min-h-0"
            >
              <TabsList className="px-6 justify-start border-b bg-white">
                <TabsTrigger
                  value="basic"
                  className={cn(getTabErrors("basic") && "text-red-500")}
                >
                  Basic Info
                </TabsTrigger>
                <TabsTrigger
                  value="pbx"
                  className={cn(getTabErrors("pbx") && "text-red-500")}
                >
                  PBX Settings
                </TabsTrigger>
                <TabsTrigger
                  value="appearance"
                  className={cn(getTabErrors("appearance") && "text-red-500")}
                >
                  Appearance
                </TabsTrigger>
                <TabsTrigger
                  value="stages"
                  className={cn(getTabErrors("stages") && "text-red-500")}
                >
                  Stages
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto">
                <TabsContent value="basic" className="p-6 m-0 h-full">
                  <BasicInfoTab />
                </TabsContent>

                <TabsContent value="pbx" className="p-6 m-0 h-full">
                  <PBXSettingsTab />
                </TabsContent>

                <TabsContent value="appearance" className="p-6 m-0 h-full">
                  <AppearanceTab />
                </TabsContent>

                <TabsContent value="stages" className="p-6 m-0 h-full">
                  <StagesTab />
                </TabsContent>
              </div>
            </Tabs>

            <div className="mt-auto px-6 py-4 border-t bg-white">
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
