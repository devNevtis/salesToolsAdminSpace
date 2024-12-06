// src/app/dashboard/companies/[id]/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { companySchema } from "@/lib/validations/company-schema";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { 
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

import { BasicInfoTab } from "@/app/components/companies/tabs/BasicInfoTab";
import { PBXSettingsTab } from "@/app/components/companies/tabs/PBXSettingsTab";
import { AppearanceTab } from "@/app/components/companies/tabs/AppearanceTab";
import { StagesTab } from "@/app/components/companies/tabs/StagesTab";

export default function CompanyDetailPage({ params }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  
  const form = useForm({
    resolver: zodResolver(companySchema),
    defaultValues: {
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
        theme: {
          base1: "#224F5A",
          base2: "#29ABE2",
          highlighting: "#66C7C3",
          callToAction: "#F25C05",
          logo: ""
        },
        stages: []
      }
    }
  });

  // Cargar datos de la compañía
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await fetch(`https://api.nevtis.com/dialtools/company/${params.id}`);
        if (!response.ok) throw new Error('Company not found');
        const data = await response.json();
        
        // Actualizar el formulario con los datos
        Object.keys(form.getValues()).forEach(key => {
          form.setValue(key, data[key], { shouldDirty: false });
        });
        
      } catch (error) {
        console.error('Error fetching company:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load company details"
        });
        router.push('/dashboard/companies');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompany();
  }, [params.id]);

  // Manejar errores de tabs
  const getTabErrors = (tabName) => {
    switch (tabName) {
      case "basic":
        return !!(form.formState.errors.name || form.formState.errors.phone || 
                 form.formState.errors.email || form.formState.errors.website || 
                 form.formState.errors.address || form.formState.errors.city || 
                 form.formState.errors.state || form.formState.errors.postalCode || 
                 form.formState.errors.country || form.formState.errors.description);
      case "pbx":
        return !!form.formState.errors.pbxUrl;
      case "appearance":
        return !!form.formState.errors.configuration?.theme;
      case "stages":
        return !!form.formState.errors.configuration?.stages;
      default:
        return false;
    }
  };

  // Guardar cambios
  const onSubmit = async (data) => {
    setIsSaving(true);
    try {
      const response = await fetch(`https://api.nevtis.com/dialtools/company/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to update company');

      toast({
        title: "Success",
        description: "Company updated successfully"
      });
      
      // Actualizar el formulario con los datos nuevos sin marcarlos como dirty
      const updatedData = await response.json();
      Object.keys(form.getValues()).forEach(key => {
        form.setValue(key, updatedData[key], { shouldDirty: false });
      });

    } catch (error) {
      console.error('Error updating company:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update company"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-24" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-[85vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/dashboard/companies')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-brand-primary">
            Edit Company: {form.watch("name")}
          </h1>
        </div>
        <Button
          onClick={form.handleSubmit(onSubmit)}
          disabled={!form.formState.isDirty || isSaving}
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Company Details</CardTitle>
          <CardDescription>
            Update your company information across all sections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="justify-start border-b bg-white">
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

                <div className="mt-4 space-y-4">
                  <TabsContent value="basic">
                    <BasicInfoTab />
                  </TabsContent>

                  <TabsContent value="pbx">
                    <PBXSettingsTab />
                  </TabsContent>

                  <TabsContent value="appearance">
                    <AppearanceTab />
                  </TabsContent>

                  <TabsContent value="stages">
                    <StagesTab />
                  </TabsContent>
                </div>
              </Tabs>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}