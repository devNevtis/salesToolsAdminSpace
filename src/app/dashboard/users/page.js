// src/app/dashboard/users/page.js
"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/store/userStore";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import UsersTable from "@/app/components/users/UsersTable";
import { Plus } from "lucide-react";
import { CreateUserDialog } from "@/app/components/users/CreateUserDialog";
import { DeleteUserDialog } from "@/app/components/users/DeleteUserDialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function UsersPage() {
  const {
    users,
    companies,
    setUsers,
    setCompanies,
    isLoading,
    setLoading,
    setError,
  } = useUserStore();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        // Fetch users
        const usersResponse = await fetch(
          "https://api.nevtis.com/dialtools/users/allUsers"
        );
        if (!usersResponse.ok) throw new Error("Failed to fetch users");
        const usersData = await usersResponse.json();
        setUsers(usersData);

        // Fetch companies
        const companiesResponse = await fetch(
          "https://api.nevtis.com/dialtools/company/all"
        );
        if (!companiesResponse.ok) throw new Error("Failed to fetch companies");
        const companiesData = await companiesResponse.json();
        setCompanies(companiesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load users data",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleCreateUser = () => {
    setSelectedUser(null);
    setCreateDialogOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setCreateDialogOpen(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;

    try {
      const endpoint = `https://api.nevtis.com/user/users/${selectedUser.role}/delete/${selectedUser._id}`;
      const response = await fetch(endpoint, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete user");

      setUsers(users.filter((user) => user._id !== selectedUser._id));
      setDeleteDialogOpen(false);
      setSelectedUser(null);

      toast({
        description: "User deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete user",
      });
    }
  };
  console.log(users);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-10 w-[150px]" />
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[140px]" />
            <Skeleton className="h-4 w-[250px]" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array(5)
              .fill(null)
              .map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  const userTypeCards = [
    {
      role: "owner",
      title: "Total Owners",
      bgColor: "bg-purple-100",
      borderColor: "border-purple-200",
      iconEmoji: "👑",
    },
    {
      role: "admin",
      title: "Total Admins",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      iconEmoji: "⚡",
    },
    {
      role: "manager",
      title: "Total Managers",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      iconEmoji: "🔷",
    },
    {
      role: "sale",
      title: "Total Sales",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      iconEmoji: "💎",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-primary">Users</h1>
          <p className="text-muted-foreground">
            Manage your organization's users and their permissions
          </p>
        </div>
        <Button onClick={handleCreateUser}>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="border bg-gray-100 border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Total Users
              <span className="text-lg">👥</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              {users.length === 1 ? "Active user" : "Active users"}
            </p>
          </CardContent>
        </Card>

        {userTypeCards.map((type) => {
          const count = users.filter((user) => user.role === type.role).length;
          return (
            <Card
              key={type.role}
              className={`border ${type.bgColor} ${type.borderColor}`}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  {type.title}
                  <span className="text-lg">{type.iconEmoji}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{count}</div>
                <p className="text-xs text-muted-foreground">
                  {count === 1 ? "Active user" : "Active users"}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Users Table */}
      <UsersTable
        users={users}
        companies={companies}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
      />

      {/* Delete Dialog */}
      <DeleteUserDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        user={selectedUser}
        onConfirm={handleDeleteConfirm}
      />

      {/* Create/Edit Dialog */}
      <CreateUserDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        initialData={selectedUser}
        companies={companies}
      />
    </div>
  );
}
