import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordChangeSchema, emailChangeSchema, twoFactorVerifySchema, PasswordChange, EmailChange, TwoFactorVerify } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Loader2, AlertTriangle, Info } from "lucide-react";

export function SecurityComponent() {
  const { toast } = useToast();
  const { user, setUser, logout } = useAuth();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);
  const [setupStep, setSetupStep] = useState<'info' | 'qr' | 'verify'>('info');
  const [twoFactorSecret, setTwoFactorSecret] = useState("");
  const [twoFactorQrCode, setTwoFactorQrCode] = useState("");
  const [isDisabling2FA, setIsDisabling2FA] = useState(false);

  // Password change form
  const passwordForm = useForm<PasswordChange>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Email change form
  const emailForm = useForm<EmailChange>({
    resolver: zodResolver(emailChangeSchema),
    defaultValues: {
      newEmail: "",
      password: "",
    },
  });

  // 2FA verification form
  const twoFactorForm = useForm<TwoFactorVerify>({
    resolver: zodResolver(twoFactorVerifySchema),
    defaultValues: {
      code: "",
    },
  });

  const handlePasswordChange = async (data: PasswordChange) => {
    setIsChangingPassword(true);
    
    try {
      const response = await apiRequest("POST", "/api/user/password", data);
      const result = await response.json();
      
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });
      
      passwordForm.reset();
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleEmailChange = async (data: EmailChange) => {
    setIsChangingEmail(true);
    
    try {
      const response = await apiRequest("POST", "/api/user/email", data);
      const result = await response.json();
      
      toast({
        title: "Email update initiated",
        description: "Please check your new email address to verify the change.",
      });
      
      emailForm.reset();
      
      // Update user context if needed
      if (setUser && user) {
        setUser({
          ...user,
          email: data.newEmail,
          isVerified: false,
        });
      }
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsChangingEmail(false);
    }
  };

  const setupTwoFactor = async () => {
    try {
      const response = await apiRequest("POST", "/api/auth/2fa/setup", undefined);
      const data = await response.json();
      
      setTwoFactorSecret(data.secret);
      setTwoFactorQrCode(data.qrCodeUrl);
      setSetupStep('qr');
    } catch (error: any) {
      toast({
        title: "Setup failed",
        description: error.message || "Failed to setup two-factor authentication.",
        variant: "destructive",
      });
    }
  };

  const verifyTwoFactor = async (data: TwoFactorVerify) => {
    try {
      const response = await apiRequest("POST", "/api/auth/2fa/verify", data);
      const result = await response.json();
      
      toast({
        title: "2FA Enabled",
        description: "Two-factor authentication has been enabled for your account.",
      });
      
      // Update user context
      if (setUser && user) {
        setUser({
          ...user,
          twoFactorEnabled: true,
        });
      }
      
      setShowTwoFactorSetup(false);
      setSetupStep('info');
      twoFactorForm.reset();
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: error.message || "Invalid verification code. Please try again.",
        variant: "destructive",
      });
    }
  };

  const disableTwoFactor = async (data: TwoFactorVerify) => {
    try {
      const response = await apiRequest("POST", "/api/auth/2fa/disable", data);
      const result = await response.json();
      
      toast({
        title: "2FA Disabled",
        description: "Two-factor authentication has been disabled for your account.",
      });
      
      // Update user context
      if (setUser && user) {
        setUser({
          ...user,
          twoFactorEnabled: false,
        });
      }
      
      setIsDisabling2FA(false);
      twoFactorForm.reset();
    } catch (error: any) {
      toast({
        title: "Disabling failed",
        description: error.message || "Invalid verification code. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>
            Change your password to keep your account secure.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Password must be at least 8 characters long.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isChangingPassword}>
                {isChangingPassword ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Change Password"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email Address</CardTitle>
          <CardDescription>
            Change your email address. You will need to verify your new email address.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="text-sm font-medium">Current Email</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            {user?.isVerified ? (
              <span className="mt-1 inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                Verified
              </span>
            ) : (
              <span className="mt-1 inline-block rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                Unverified
              </span>
            )}
          </div>
          
          <Form {...emailForm}>
            <form onSubmit={emailForm.handleSubmit(handleEmailChange)} className="space-y-4">
              <FormField
                control={emailForm.control}
                name="newEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="new@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={emailForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isChangingEmail}>
                {isChangingEmail ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Change Email"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>
            Add an extra layer of security to your account by requiring a verification code.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="font-medium">Two-Factor Authentication</h4>
              <p className="text-sm text-muted-foreground">
                {user?.twoFactorEnabled
                  ? "Your account is protected with two-factor authentication."
                  : "Protect your account with two-factor authentication."}
              </p>
            </div>
            <Switch
              checked={user?.twoFactorEnabled || false}
              onCheckedChange={(checked) => {
                if (checked) {
                  setShowTwoFactorSetup(true);
                } else if (user?.twoFactorEnabled) {
                  setIsDisabling2FA(true);
                }
              }}
            />
          </div>

          {/* Setup 2FA Dialog */}
          <Dialog open={showTwoFactorSetup} onOpenChange={setShowTwoFactorSetup}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Setup Two-Factor Authentication</DialogTitle>
                <DialogDescription>
                  Protect your account with two-factor authentication.
                </DialogDescription>
              </DialogHeader>
              
              {setupStep === 'info' && (
                <div className="space-y-4 py-4">
                  <Alert variant="default">
                    <Info className="h-4 w-4" />
                    <AlertTitle>How it works</AlertTitle>
                    <AlertDescription>
                      You'll need an authenticator app like Google Authenticator, Authy, or Microsoft Authenticator on your phone.
                    </AlertDescription>
                  </Alert>
                  <ol className="ml-4 list-decimal space-y-2 text-sm">
                    <li>Download an authenticator app on your phone</li>
                    <li>Scan the QR code with the app</li>
                    <li>Enter the verification code from the app</li>
                  </ol>
                  <Button onClick={setupTwoFactor} className="w-full">
                    Continue
                  </Button>
                </div>
              )}
              
              {setupStep === 'qr' && (
                <div className="space-y-4 py-4">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <img src={twoFactorQrCode} alt="QR Code" className="h-64 w-64" />
                    <div className="text-center">
                      <p className="text-sm font-medium">Can't scan the QR code?</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Enter this code manually in your app:
                      </p>
                      <p className="mt-1 select-all rounded-md bg-muted p-2 text-sm font-mono">
                        {twoFactorSecret}
                      </p>
                    </div>
                  </div>
                  <Button onClick={() => setSetupStep('verify')} className="w-full">
                    Continue
                  </Button>
                </div>
              )}
              
              {setupStep === 'verify' && (
                <div className="space-y-4 py-4">
                  <p className="text-sm text-muted-foreground">
                    Enter the 6-digit verification code from your authenticator app.
                  </p>
                  <Form {...twoFactorForm}>
                    <form onSubmit={twoFactorForm.handleSubmit(verifyTwoFactor)} className="space-y-4">
                      <FormField
                        control={twoFactorForm.control}
                        name="code"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Verification Code</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="123456"
                                maxLength={6}
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full">
                        Verify and Enable
                      </Button>
                    </form>
                  </Form>
                </div>
              )}
              
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowTwoFactorSetup(false);
                    setSetupStep('info');
                  }}
                >
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Disable 2FA Dialog */}
          <Dialog open={isDisabling2FA} onOpenChange={setIsDisabling2FA}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Disable Two-Factor Authentication</DialogTitle>
                <DialogDescription>
                  You are about to disable two-factor authentication for your account.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Warning</AlertTitle>
                  <AlertDescription>
                    This will reduce the security of your account. Are you sure you want to continue?
                  </AlertDescription>
                </Alert>
                <Form {...twoFactorForm}>
                  <form onSubmit={twoFactorForm.handleSubmit(disableTwoFactor)} className="space-y-4">
                    <FormField
                      control={twoFactorForm.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Verification Code</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="123456"
                              maxLength={6}
                              inputMode="numeric"
                              autoComplete="one-time-code"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" variant="destructive" className="w-full">
                      Disable Two-Factor Authentication
                    </Button>
                  </form>
                </Form>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDisabling2FA(false)}
                >
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
          <CardDescription>
            Manage your account access and data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium">Log Out from All Devices</h4>
            <p className="text-sm text-muted-foreground mb-2">
              This will log you out from all devices except the current one.
            </p>
            <Button variant="outline" onClick={() => {
              apiRequest("POST", "/api/auth/logout-all", undefined)
                .then(() => {
                  toast({
                    title: "Success",
                    description: "You have been logged out from all other devices.",
                  });
                })
                .catch((error) => {
                  toast({
                    title: "Error",
                    description: error.message || "Failed to log out from other devices.",
                    variant: "destructive",
                  });
                });
            }}>
              Log Out from All Devices
            </Button>
          </div>
          
          <div className="pt-4 border-t">
            <h4 className="font-medium text-red-600">Delete Account</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Permanently delete your account and all associated data.
            </p>
            <Button variant="destructive" onClick={() => {
              toast({
                title: "Account Deletion",
                description: "This feature is not enabled in the demo version.",
              });
            }}>
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
