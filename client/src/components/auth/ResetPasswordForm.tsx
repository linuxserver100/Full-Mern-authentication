import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordResetSchema, PasswordReset } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import { Loader2, Check, ArrowLeft } from "lucide-react";

export function ResetPasswordForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);
  const [, setLocation] = useLocation();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Get token from URL
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");
    
    if (!urlToken) {
      toast({
        title: "Invalid reset link",
        description: "The password reset link is invalid or has expired.",
        variant: "destructive",
      });
      setLocation("/forgot-password");
      return;
    }
    
    setToken(urlToken);
  }, [setLocation, toast]);

  const form = useForm<PasswordReset>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      token: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (token) {
      form.setValue("token", token);
    }
  }, [token, form]);

  const onSubmit = async (data: PasswordReset) => {
    setIsLoading(true);
    
    try {
      const response = await apiRequest("POST", "/api/auth/reset-password", data);
      const result = await response.json();
      
      setResetComplete(true);
      toast({
        title: "Password reset successful",
        description: "Your password has been reset successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Password reset failed",
        description: error.message || "The reset link is invalid or has expired.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (resetComplete) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Password Reset Complete</CardTitle>
          <CardDescription className="text-center text-base">
            Your password has been reset successfully. You can now log in with your new password.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col pt-4">
          <Link href="/login">
            <Button className="w-full">Go to Login</Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  if (!token) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Invalid Reset Link</CardTitle>
          <CardDescription>
            The password reset link is invalid or has expired. Please request a new one.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col pt-4">
          <Link href="/forgot-password">
            <Button className="w-full" variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Forgot Password
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Reset Your Password</CardTitle>
        <CardDescription>
          Enter a new password for your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="••••••••"
                      type="password"
                      autoComplete="new-password"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="••••••••"
                      type="password"
                      autoComplete="new-password"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <div className="text-center text-sm">
          <span>Remember your password? </span>
          <Link href="/login">
            <a className="font-semibold text-primary-600 hover:text-primary-500">
              Log in
            </a>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
