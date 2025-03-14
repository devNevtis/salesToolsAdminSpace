//src/app/components/layout/Header.jsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import Cookies from "js-cookie";
import { Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const Header = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = Cookies.get("token");

      if (!token) return;

      try {
        const response = await axios.post(
          "https://api.nevtis.com/dialtools/auth/me",

          {
            userLocalStorg: {
              token,
            },
          }
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <header className="border-b bg-white h-[8vh]">
      <div className="flex h-16 items-center px-4">
        {/* Logo centered */}
        <div className="flex-1 flex justify-center">
          <Image
            src="/DialToolProLogo.png"
            alt="DialTools Pro"
            width={173}
            height={22}
            className="h-8 w-auto"
            priority
          />
        </div>

        {/* Profile section - right aligned */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-brand-primary">
              {user?.name}
            </span>
            <span className="text-xs text-brand-secondary">{user?.role}</span>
          </div>
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
            <AvatarFallback className="bg-brand-accent text-white">
              JD
            </AvatarFallback>
          </Avatar>
          <Link
            href="/profile/edit"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Settings className="h-5 w-5 text-brand-primary" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
