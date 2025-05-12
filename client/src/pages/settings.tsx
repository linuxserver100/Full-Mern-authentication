import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { SettingsComponent } from "@/components/dashboard/Settings";
import { SecurityComponent } from "@/components/dashboard/Security";
import { Helmet } from "react-helmet";

export default function Settings() {
  const [location] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const renderContent = () => {
    if (location === "/settings/security") {
      return (
        <>
          <Helmet>
            <title>Security Settings | Authentication System</title>
            <meta name="description" content="Manage your account security settings." />
          </Helmet>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Security Settings</h1>
          </div>
          <SecurityComponent />
        </>
      );
    } else if (location === "/settings/sessions") {
      return (
        <>
          <Helmet>
            <title>Session Management | Authentication System</title>
            <meta name="description" content="Manage your active sessions and devices." />
          </Helmet>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Active Sessions</h1>
          </div>
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Session management functionality is available in the security settings.
            </p>
          </div>
        </>
      );
    } else {
      return (
        <>
          <Helmet>
            <title>Settings | Authentication System</title>
            <meta name="description" content="Manage your account settings and preferences." />
          </Helmet>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Settings</h1>
          </div>
          <SettingsComponent />
        </>
      );
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
