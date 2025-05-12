import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { twoFactorVerifySchema, TwoFactorVerify } from "@shared/schema";
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
import { Loader2 } from "lucide-react";

interface TwoFactorAuthProps {
  tempToken: string;
}

export function TwoFactorAuth({ tempToken }: TwoFactorAuthProps) {
  const { toast } = useToast();
  const { setUser, setToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<TwoFactorVerify>({
    resolver: zodResolver(twoFactorVerifySchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: TwoFactorVerify) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/2fa/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tempToken}`
        },
        body: JSON.stringify(data),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Invalid verification code');
      }
      
      const result = await response.json();
      
      // Save auth data
      setToken(result.token);
      setUser(result.user);
      
      toast({
        title: "Verification successful",
        description: "You have been logged in successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: error.message || "Invalid verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Two-Factor Authentication</CardTitle>
        <CardDescription>
          Enter the verification code from your authenticator app
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Open your authenticator app and enter the 6-digit verification code for this account.
          </p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="123456"
                      type="text"
                      maxLength={6}
                      inputMode="numeric"
                      autoComplete="one-time-code"
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
                  Verifying...
                </>
              ) : (
                "Verify"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <p className="text-sm text-muted-foreground">
          If you're having trouble, please contact support.
        </p>
      </CardFooter>
    </Card>
  );
}
