//src/app/components/layout/Sidebar.jsx
"use client";

import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Menu,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard
  },
  {
    title: "Companies",
    href: "/dashboard/companies",
    icon: Building2
  },
  {
    title: "Users",
    href: "/dashboard/users",
    icon: Users
  }
];

const Sidebar = () => {
  const pathname = usePathname();

  const SidebarContent = () => (
    <div className="flex min-h-[92vh] flex-col gap-4 py-4 bg-white">
      <div className="px-4 py-2">
        <h2 className="text-lg font-semibold text-brand-primary">Menu</h2>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                isActive 
                  ? "bg-brand-primary text-white" 
                  : "text-brand-primary hover:bg-brand-primary/10"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden border-r lg:block w-64">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            className="lg:hidden hover:bg-brand-primary/10"
          >
            <Menu className="h-6 w-6 text-brand-primary" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Sidebar;