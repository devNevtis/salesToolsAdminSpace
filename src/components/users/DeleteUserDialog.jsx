// src/app/components/users/DeleteUserDialog.jsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const DeleteUserDialog = ({ 
  open, 
  onOpenChange, 
  user, 
  onConfirm,
  isDeleting = false
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription className="space-y-2">
            <p>Are you sure you want to delete the following user?</p>
            {user && (
              <div className="bg-muted p-3 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{user.name}</span>
                  <Badge variant="outline" className="capitalize">
                    {user.role}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>{user.email}</p>
                  <p>{user.position}</p>
                </div>
              </div>
            )}
            <p className="text-destructive">
              This action cannot be undone. This will permanently delete the user account
              and remove all associated data.
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};