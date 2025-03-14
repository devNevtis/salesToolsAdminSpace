//src/app/components/companies/CompaniesTable.jsx
"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { useCompanyStore } from "@/store/companyStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import {
  MoreHorizontal,
  Mail,
  Phone,
  MessageSquare,
  Globe,
  MapPin,
  Copy,
  Pencil,
  Trash,
} from "lucide-react";
import { useUserStore } from "@/store/userStore";
import Cookies from "js-cookie";
export const CompaniesTable = () => {
  //REEMPLAZAR POR EL USUARIO LOGUEADO
  const userLogin = Cookies.get("token");

  const { companies, removeCompany } = useCompanyStore();
  const { users } = useUserStore();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [emailDialog, setEmailDialog] = useState(false);
  const [phoneDialog, setPhoneDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    email: true,
    phone: true,
    location: true,
    website: true,
  });

  const columns = [
    { key: "name", label: "Company Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "location", label: "Location" },
    { key: "website", label: "Website" },
  ];
  const handleEmailClick = (company) => {
    setSelectedCompany(company);
    setEmailDialog(true);
  };

  const handlePhoneClick = (company) => {
    setSelectedCompany(company);
    setPhoneDialog(true);
  };

  const handleLocationClick = (address) => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address
    )}`;
    window.open(mapsUrl, "_blank");
  };

  const handleWebsiteClick = (website) => {
    window.open(website, "_blank");
  };

  const handleDelete = async () => {
    if (!selectedCompany) return;

    setIsDeleting(true);
    try {
      const response = await api.delete(`/company/${selectedCompany._id}`);

      if (response.status === 200) {
        removeCompany(selectedCompany._id);
        setDeleteDialog(false);
        toast({
          description: "Company deleted successfully",
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Failed to delete company",
      });
    } finally {
      setIsDeleting(false);
      setSelectedCompany(null);
    }
  };

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedCompanies = filteredCompanies.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const totalPages = Math.ceil(filteredCompanies.length / rowsPerPage);

  return (
    <div className="space-y-4">
      {/* Barra superior con búsqueda y selector de columnas */}
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search businesses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Columns</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            {columns.map((column) => (
              <div key={column.key} className="flex items-center space-x-2 p-2">
                <Checkbox
                  checked={visibleColumns[column.key]}
                  onCheckedChange={(checked) =>
                    setVisibleColumns((prev) => ({
                      ...prev,
                      [column.key]: checked,
                    }))
                  }
                />
                <span>{column.label}</span>
              </div>
            ))}
            <Button
              variant="ghost"
              className="w-full mt-2"
              onClick={() =>
                setVisibleColumns({
                  name: true,
                  email: true,
                  phone: true,
                  location: true,
                  website: true,
                })
              }
            >
              Reset to Default
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Tabla */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map(
                (column) =>
                  visibleColumns[column.key] && (
                    <TableHead key={column.key}>{column.label}</TableHead>
                  )
              )}
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedCompanies.map((company) => (
              <TableRow key={company._id}>
                {visibleColumns.name && (
                  <TableCell>
                    <Link
                      href={`/dashboard/companies/${company._id}`}
                      className="text-brand-primary hover:underline"
                    >
                      {company.name}
                    </Link>
                  </TableCell>
                )}
                {visibleColumns.email && (
                  <TableCell>
                    <button
                      onClick={() => handleEmailClick(company)}
                      className="text-brand-secondary hover:underline"
                    >
                      {company.email}
                    </button>
                  </TableCell>
                )}
                {visibleColumns.phone && (
                  <TableCell>
                    <button
                      onClick={() => handlePhoneClick(company)}
                      className="text-brand-secondary hover:underline"
                    >
                      {company.phone}
                    </button>
                  </TableCell>
                )}
                {visibleColumns.location && (
                  <TableCell>
                    <button
                      onClick={() => handleLocationClick(company.address)}
                      className="flex items-center gap-1 text-brand-secondary hover:underline"
                    >
                      <MapPin className="h-4 w-4" />
                      Location
                    </button>
                  </TableCell>
                )}
                {visibleColumns.website && (
                  <TableCell>
                    <button
                      onClick={() => handleWebsiteClick(company.website)}
                      className="flex items-center gap-1 text-brand-secondary hover:underline"
                    >
                      <Globe className="h-4 w-4" />
                      Visit
                    </button>
                  </TableCell>
                )}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          handleWebsiteClick(
                            `https://app.salestoolspro.com/${userLogin}/${company.email}`
                          )
                        }
                      >
                        <Globe className="mr-2 h-4 w-4" />
                        Login as {company.name}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          navigator.clipboard.writeText(company._id)
                        }
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy ID
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          (window.location.href = `/dashboard/companies/${company._id}`)
                        }
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        More Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => {
                          setSelectedCompany(company);
                          setDeleteDialog(true);
                        }}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {(page - 1) * rowsPerPage + 1} to{" "}
          {Math.min(page * rowsPerPage, filteredCompanies.length)} of{" "}
          {filteredCompanies.length} entries
        </p>
        <div className="flex items-center gap-2">
          <Select
            value={rowsPerPage.toString()}
            onValueChange={(value) => {
              setRowsPerPage(Number(value));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue>{rowsPerPage}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50].map((value) => (
                <SelectItem key={value} value={value.toString()}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(1)}
              disabled={page === 1}
            >
              {"<<"}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              {"<"}
            </Button>
            <span className="px-4 py-2">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              {">"}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
            >
              {">>"}
            </Button>
          </div>
        </div>
      </div>

      {/* Diálogo de Email */}
      <Dialog open={emailDialog} onOpenChange={setEmailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Email to {selectedCompany?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Email: {selectedCompany?.email}</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Teléfono */}
      <Dialog open={phoneDialog} onOpenChange={setPhoneDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact {selectedCompany?.name}</DialogTitle>
          </DialogHeader>
          <div className="flex gap-4">
            <Button
              onClick={() => window.open(`tel:${selectedCompany?.phone}`)}
              className="flex-1"
            >
              <Phone className="mr-2 h-4 w-4" />
              Call
            </Button>
            <Button
              onClick={() => window.open(`sms:${selectedCompany?.phone}`)}
              className="flex-1"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Send SMS
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Eliminación */}
      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Company</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedCompany?.name}? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompaniesTable;
