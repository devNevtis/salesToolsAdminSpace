// src/app/components/users/UsersTable.jsx
"use client";

import { useState } from "react";
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  MoreHorizontal,
  Mail,
  Phone,
  Copy,
  Pencil,
  Trash,
  ListFilter,
} from "lucide-react";

const getRoleColor = (role) => {
  switch (role?.toLowerCase()) {
    case 'owner':
      return 'bg-purple-100 text-purple-800';
    case 'manager':
      return 'bg-blue-100 text-blue-800';
    case 'sale':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-500';
  }
};

const getDisplayRole = (role) => {
  if (!role) return {
    text: 'Unassigned',
    tooltip: 'This user needs a role assignment'
  };

  return {
    text: role.charAt(0).toUpperCase() + role.slice(1),
    tooltip: null
  };
};

const getInitials = (firstName, lastName) => {
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
};

export const UsersTable = ({
  users = [],
  companies = [],
  onEdit,
  onDelete,
}) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [visibleColumns, setVisibleColumns] = useState({
    user: true,
    role: true,
    company: true,
    contact: true,
    position: true,
  });

  const columns = [
    { key: 'user', label: 'User' },
    { key: 'role', label: 'Role' },
    { key: 'company', label: 'Company' },
    { key: 'contact', label: 'Contact' },
    { key: 'position', label: 'Position' },
  ];

  const safeStringIncludes = (text, search) => {
    if (!text) return false;
    return text.toString().toLowerCase().includes(search.toLowerCase());
  };
  
  const matchesSearchTerm = (user, searchTerm) => {
    if (!searchTerm) return true;
    
    return [
      user?.name,
      user?.email,
      user?.position,
      user?.phone
    ].some(field => safeStringIncludes(field, searchTerm));
  };
  
  const filteredUsers = users.filter(user => {
    const matchesSearch = matchesSearchTerm(user, searchTerm);
    const matchesRole = roleFilter === "all" || 
      (roleFilter === "unassigned" ? !user.role : user.role === roleFilter);
    const matchesCompany = companyFilter === "all" || 
      user.companyId === companyFilter;
    
    return matchesSearch && matchesRole && matchesCompany;
  });

  const paginatedUsers = filteredUsers.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email);
    toast({
      description: "Email copied to clipboard"
    });
  };

  const handleCopyPhone = (phone) => {
    navigator.clipboard.writeText(phone);
    toast({
      description: "Phone number copied to clipboard"
    });
  };

  const getCompanyName = (companyId) => {
    return companies.find(company => company._id === companyId)?.name || 'Unknown Company';
  };

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-1 items-center gap-4 min-w-[280px]">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="owner">Owners</SelectItem>
              <SelectItem value="manager">Managers</SelectItem>
              <SelectItem value="sale">Sales</SelectItem>
              <SelectItem value="unassigned">Unassigned</SelectItem>
            </SelectContent>
          </Select>
          <Select value={companyFilter} onValueChange={setCompanyFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by company" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Companies</SelectItem>
              {companies.map((company) => (
                <SelectItem key={company._id} value={company._id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              <ListFilter className="h-4 w-4 mr-2" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            {columns.map(column => (
              <div key={column.key} className="flex items-center space-x-2 p-2">
                <Checkbox
                  checked={visibleColumns[column.key]}
                  onCheckedChange={(checked) => 
                    setVisibleColumns(prev => ({...prev, [column.key]: checked}))
                  }
                />
                <span>{column.label}</span>
              </div>
            ))}
            <DropdownMenuSeparator />
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => 
                setVisibleColumns({
                  user: true,
                  role: true,
                  company: true,
                  contact: true,
                  position: true,
                })
              }
            >
              Reset to Default
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumns.user && <TableHead>User</TableHead>}
              {visibleColumns.role && <TableHead>Role</TableHead>}
              {visibleColumns.company && <TableHead>Company</TableHead>}
              {visibleColumns.contact && <TableHead>Contact</TableHead>}
              {visibleColumns.position && <TableHead>Position</TableHead>}
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
              {/* Primero el mensaje de "no results" */}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell 
                    colSpan={Object.values(visibleColumns).filter(Boolean).length + 1}
                    className="h-24 text-center"
                  >
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <p>No users found</p>
                      {searchTerm && (
                        <p className="text-sm">
                          Try adjusting your search or filters
                        </p>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            {paginatedUsers.map((user) => (
              <TableRow key={user._id}>
                {visibleColumns.user && (
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.profilePhoto} />
                        <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <Link 
                          href={`/dashboard/users/${user._id}`}
                          className="font-medium hover:underline"
                        >
                          {user.name}
                        </Link>
                        <span className="text-sm text-muted-foreground">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                )}
                {visibleColumns.role && (
                  <TableCell>
                    <div className="relative group">
                      <Badge className={getRoleColor(user.role)}>
                        {getDisplayRole(user.role).text}
                      </Badge>
                      {getDisplayRole(user.role).tooltip && (
                        <div className="absolute hidden group-hover:block z-50 p-2 bg-black text-white text-xs rounded shadow-lg -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                          {getDisplayRole(user.role).tooltip}
                        </div>
                      )}
                    </div>
                  </TableCell>
                )}
                {visibleColumns.company && (
                  <TableCell>
                    <span className="font-medium">
                      {getCompanyName(user.companyId)}
                    </span>
                  </TableCell>
                )}
                {visibleColumns.contact && (
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopyEmail(user.email)}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopyPhone(user.phone)}
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                )}
                {visibleColumns.position && (
                  <TableCell>{user.position}</TableCell>
                )}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user._id)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy ID
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(user)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => onDelete(user)}
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

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {((page - 1) * rowsPerPage) + 1} to {Math.min(page * rowsPerPage, filteredUsers.length)} of {filteredUsers.length} entries
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
              {'<<'}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              {'<'}
            </Button>
            <span className="px-4 py-2">Page {page} of {totalPages}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              {'>'}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
            >
              {'>>'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersTable;