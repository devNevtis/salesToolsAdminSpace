//src/app/dashboard/companies/page.js
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CompaniesTable } from "@/components/companies/CompaniesTable";
import { CompanyDialog } from "@/components/companies/CompanyDialog";
import { useCompanyStore } from "@/store/companyStore";
import { Plus } from "lucide-react";

export default function CompaniesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const { companies, setCompanies, isLoading, setLoading, error } =
    useCompanyStore();

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/companies");
        if (!response.ok) {
          throw new Error("Failed to fetch companies");
        }
        const data = await response.json();
        setCompanies(data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
      setLoading(false);
    };

    fetchCompanies();
  }, [setCompanies, setLoading]);

  const handleCreateCompany = async (data) => {
    try {
      const response = await fetch("/api/companies", {
        method: "POST",
        body: JSON.stringify(data),
      });

      const newCompany = await response.json();
      setCompanies([...companies, newCompany]);
      setDialogOpen(false);
    } catch (error) {
      console.error("Failed to create company:", error);
    }
  };

  const handleEditCompany = (company) => {
    setSelectedCompany(company);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-brand-primary">Companies</h1>
        <Button
          onClick={() => {
            setSelectedCompany(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Company
        </Button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <CompaniesTable companies={companies} onEdit={handleEditCompany} />
      )}

      <CompanyDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={selectedCompany}
        onSubmit={handleCreateCompany}
      />
    </div>
  );
}
