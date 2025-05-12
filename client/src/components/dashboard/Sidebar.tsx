import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  User,
  Settings,
  Shield,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";

interface SidebarLinkProps {
  href: string;
  icon: ReactNode;
  children: ReactNode;
  active?: boolean;
}

function SidebarLink({ href, icon, children, active }: SidebarLinkProps) {
  return (
    <Link href={href}>
      <a
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary-500",
          active
            ? "bg-primary-50 text-primary-700 dark:bg-gray-800 dark:text-primary-400"
            : "text-gray-700 dark:text-gray-300"
        )}
      >
        {icon}
        <span>{children}</span>
      </a>
    </Link>
  );
}

export function Sidebar() {
  const [location] = useLocation();
  const { logout } = useAuth();
  const [securityOpen, setSecurityOpen] = useState(true);

  const isActive = (path: string) => {
    return location === path;
  };

  const isSecurityPage = location === "/settings/security" || location === "/settings/sessions";

  return (
    <div className="h-screen w-64 border-r bg-sidebar p-4 dark:border-gray-800">
      <div className="flex flex-col space-y-6">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Dashboard
          </h2>
          <div className="space-y-1">
            <SidebarLink
              href="/dashboard"
              icon={<LayoutDashboard className="h-5 w-5" />}
              active={isActive("/dashboard")}
            >
              Overview
            </SidebarLink>
            <SidebarLink
              href="/profile"
              icon={<User className="h-5 w-5" />}
              active={isActive("/profile")}
            >
              Profile
            </SidebarLink>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Settings
          </h2>
          <div className="space-y-1">
            <SidebarLink
              href="/settings"
              icon={<Settings className="h-5 w-5" />}
              active={isActive("/settings") && !isSecurityPage}
            >
              General
            </SidebarLink>
            <Collapsible
              open={securityOpen}
              onOpenChange={setSecurityOpen}
              className="w-full"
            >
              <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left hover:text-primary-500">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5" />
                  <span>Security</span>
                </div>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    securityOpen ? "rotate-180" : ""
                  )}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 py-1">
                <div className="space-y-1">
                  <SidebarLink
                    href="/settings/security"
                    icon={<div className="h-2 w-2" />}
                    active={isActive("/settings/security")}
                  >
                    Security Settings
                  </SidebarLink>
                  <SidebarLink
                    href="/settings/sessions"
                    icon={<div className="h-2 w-2" />}
                    active={isActive("/settings/sessions")}
                  >
                    Sessions
                  </SidebarLink>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 left-4 right-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
          onClick={logout}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );
}
