import { useState } from "react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordResetRequestSchema, PasswordResetRequest } from "@shared/schema";
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
import { Loader2, ArrowLeft } from "lucide-react";

export function ForgotPasswordForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<PasswordResetRequest>({
    resolver: zodResolver(passwordResetRequestSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: PasswordResetRequest) => {
    setIsLoading(true);
    
    try {
      const response = await apiRequest("POST", "/api/auth/forgot-password", data);
      const result = await response.json();
      
      setEmailSent(true);
      toast({
        title: "Request sent",
        description: "If your email is registered, you will receive a password reset link.",
      });
    } catch (error: any) {
      toast({
        title: "Request failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-primary-600">Check Your Email</CardTitle>
          <CardDescription className="text-base">
            If an account exists with the email you provided, we've sent password reset instructions to that address.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-500">
            If you don't see the email in your inbox, please check your spam folder. The link will expire in 1 hour.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Link href="/login">
            <Button className="w-full" variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
        <CardDescription>
          Enter your email address and we'll send you a link to reset your password
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="name@example.com"
                      type="email"
                      autoComplete="email"
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
                  Sending...
                </>
              ) : (
                "Send Reset Link"
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
