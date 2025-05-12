import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Shield, User, Settings, ChevronRight } from "lucide-react";

export default function Dashboard() {
  const [location, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();

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

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="flex h-screen">
      <Helmet>
        <title>Dashboard | Authentication System</title>
        <meta name="description" content="View and manage your account dashboard." />
      </Helmet>
      
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div>
              <span className="text-sm text-muted-foreground">
                Welcome back, {user.firstName || user.username}
              </span>
            </div>
          </div>
          
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Profile Status
                </CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {user.isVerified ? "Verified" : "Unverified"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {user.isVerified 
                    ? "Your account is fully verified" 
                    : "Please verify your email address"}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  2FA Status
                </CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {user.twoFactorEnabled ? "Enabled" : "Disabled"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {user.twoFactorEnabled 
                    ? "Two-factor authentication is active" 
                    : "Consider enabling 2FA for extra security"}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Account Type
                </CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  Standard
                </div>
                <p className="text-xs text-muted-foreground">
                  Your account has standard privileges
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="account">
            <TabsList className="mb-4">
              <TabsTrigger value="account">Account Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    Overview of your account details and status
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium leading-none">
                      Profile
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Manage your profile information and visibility
                    </p>
                  </div>
                  <div className="flex justify-between items-center border-b pb-4">
                    <div>
                      <div className="font-medium">Personal Information</div>
                      <div className="text-sm text-muted-foreground">
                        Update your name, username, and other details
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setLocation("/profile")} className="flex items-center">
                      Edit
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-center border-b pb-4">
                    <div>
                      <div className="font-medium">Email Address</div>
                      <div className="text-sm text-muted-foreground">
                        {user.email}
                        {user.isVerified ? (
                          <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                            Verified
                          </span>
                        ) : (
                          <span className="ml-2 inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            Unverified
                          </span>
                        )}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setLocation("/settings")} className="flex items-center">
                      Change
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Account Security</div>
                      <div className="text-sm text-muted-foreground">
                        Manage your password and enable two-factor authentication
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setLocation("/settings/security")} className="flex items-center">
                      Manage
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your recent account activity and login history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-b pb-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium">Login</div>
                        <div className="text-sm text-muted-foreground">Just now</div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Logged in from {navigator.userAgent.includes("Windows") ? "Windows" : navigator.userAgent.includes("Mac") ? "Mac" : "Unknown"} device
                      </div>
                    </div>
                    
                    <div className="border-b pb-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium">Profile Update</div>
                        <div className="text-sm text-muted-foreground">Yesterday</div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Updated profile information
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium">Account Created</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date().toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Account was created and registered
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Overview</CardTitle>
                  <CardDescription>
                    Review your account security settings and recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center space-x-2">
                        <Shield className={`h-5 w-5 ${user.twoFactorEnabled ? "text-green-500" : "text-yellow-500"}`} />
                        <div>
                          <div className="font-medium">Two-Factor Authentication</div>
                          <div className="text-sm text-muted-foreground">
                            {user.twoFactorEnabled ? "Enabled" : "Not enabled"}
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant={user.twoFactorEnabled ? "outline" : "default"} 
                        size="sm" 
                        onClick={() => setLocation("/settings/security")}
                      >
                        {user.twoFactorEnabled ? "Manage" : "Enable"}
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-green-500" />
                        <div>
                          <div className="font-medium">Password Updated</div>
                          <div className="text-sm text-muted-foreground">
                            Recently updated
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setLocation("/settings/security")}
                      >
                        Change
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <div className="font-medium">Account Status</div>
                          <div className="text-sm text-muted-foreground">
                            Active and healthy
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setLocation("/settings/sessions")}
                      >
                        Sessions
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
