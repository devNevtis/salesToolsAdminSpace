"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema } from "@/lib/validations/user-schema";
import { useUserStore } from "@/store/userStore";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

export const CreateUserDialog = ({
  open,
  onOpenChange,
  initialData,
  companies = [],
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [managers, setManagers] = useState([]);
  const [extensions, setExtension] = useState([]);
  const [activeTab, setActiveTab] = useState("basic");
  const { setUsers, users } = useUserStore();

  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: initialData?.role || "sale",
      name: "",
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      defaultValues: {
        extension: initialData?.extension || null,
      },
      position: initialData?.position || "",
      companyId: initialData?.companyId || "",
      vText: initialData?.vText || [],
      managerId: initialData?.managerId || null,
      commissionRate: initialData?.commissionRate || 0,
      ...initialData,
    },
  });

  const getCompanyById = (companyId) => {
    return companies.find((company) => company._id === companyId);
  };
  const selectedCompanyId = form.watch("companyId");

  useEffect(() => {
    const { firstName, lastName } = form.getValues();
    if (firstName || lastName) {
      form.setValue("name", `${firstName} ${lastName}`.trim());
    }
  }, [form.getValues("firstName"), form.getValues("lastName")]);

  useEffect(() => {
    const fetchManagers = async () => {
      const companyId = form.getValues("companyId");
      if (!companyId || form.getValues("role") !== "sale") return;

      try {
        const response = await fetch(
          "https://api.nevtis.com/user/users/manager/all"
        );
        if (!response.ok) throw new Error("Failed to fetch managers");
        const data = await response.json();
        setManagers(data.filter((manager) => manager.companyId === companyId));
      } catch (error) {
        console.error("Error fetching managers:", error);
        toast({
          variant: "destructive",
          description: "Failed to load managers",
        });
      }
    };

    fetchManagers();
  }, [form.getValues("companyId"), form.getValues("role")]);

  useEffect(() => {
    const fetchExtensions = async () => {
      if (!selectedCompanyId) return;
      const companyId = form.getValues("companyId");
      if (!companyId) return;
      try {
        const response = await fetch(
          `https://api.nevtis.com/fusionpbx/extensions/serv2/getAllExtensionsByDomain/${
            getCompanyById(form.getValues("companyId")).pbxUrl.domain_uuid
          }/resume`
        );

        console.log(response);

        if (!response.ok) throw new Error("Failed to fetch extensions");

        const data = await response.json();
        setExtension(data);
      } catch (error) {
        console.error("Error fetching extensions:", error);
        toast({
          variant: "destructive",
          description: "Failed to load extensions",
        });
      }
    };

    fetchExtensions();
  }, [form.getValues("companyId")]);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      let endpoint;
      switch (form.getValues("role")) {
        case "owner":
          endpoint = "https://api.nevtis.com/dialtools/users/owner/create";
          break;
        case "manager":
          endpoint = "https://api.nevtis.com/dialtools/users/manager/create";
          break;
        case "sale":
          endpoint =
            "https://api.nevtis.com/dialtools/users/saledialtools/create";
          break;
        default:
          throw new Error("Invalid role selected");
      }

      console.log("Enviando a:", endpoint);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form.getValues()),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save user");
      }

      const savedUser = await response.json();
      console.log("Server response:", savedUser);

      setUsers([...users, savedUser]);

      toast({
        description: `User created successfully`,
      });

      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Error saving user:", error);
      toast({
        variant: "destructive",
        description: error.message || "Failed to save user",
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
            {initialData ? "Edit User" : "Create New User"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            className="flex flex-col h-full"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex-1 flex flex-col min-h-0"
            >
              <TabsList className="px-6 justify-start border-b bg-white">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto p-6">
                <TabsContent value="basic" className="mt-0 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>User Role</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={initialData}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="owner">Owner</SelectItem>
                              <SelectItem value="manager">Manager</SelectItem>
                              <SelectItem value="sale">Sales</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="companyId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select company" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {companies.map((company) => (
                                <SelectItem
                                  key={company._id}
                                  value={company._id}
                                >
                                  {company.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="extension"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Extension</FormLabel>
                          <Select
                            value={field.value?.extension || ""}
                            onValueChange={(value) => {
                              const selectedExtension = extensions.find(
                                (ext) => ext.extension === value
                              );
                              form.setValue(
                                "extension",
                                selectedExtension || null
                              );
                            }}
                            disabled={!selectedCompanyId}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Extension" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {extensions.map((ext) => (
                                <SelectItem
                                  key={ext.extension}
                                  value={ext.extension}
                                >
                                  {ext.extension} -{" "}
                                  {ext.effective_caller_id_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter position" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                <Button onClick={() => handleSubmit()} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create User"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserDialog;
