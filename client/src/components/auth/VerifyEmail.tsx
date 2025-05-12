import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Check, X, AlertTriangle, ArrowLeft } from "lucide-react";

export function VerifyEmailComponent() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [, setLocation] = useLocation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      // Get token from URL
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      
      if (!token) {
        setVerificationStatus('error');
        setErrorMessage("Verification token is missing.");
        setIsLoading(false);
        return;
      }
      
      try {
        const response = await apiRequest("GET", `/api/auth/verify-email?token=${token}`, undefined);
        const result = await response.json();
        
        setVerificationStatus('success');
        toast({
          title: "Email verified",
          description: "Your email has been verified successfully!",
        });
      } catch (error: any) {
        setVerificationStatus('error');
        setErrorMessage(error.message || "Email verification failed. The link may be invalid or expired.");
        toast({
          title: "Verification failed",
          description: error.message || "The verification link is invalid or has expired.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [toast]);

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        {isLoading ? (
          <>
            <div className="flex justify-center mb-4">
              <Loader2 className="h-12 w-12 text-primary-600 animate-spin" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">Verifying Your Email</CardTitle>
            <CardDescription className="text-center text-base">
              Please wait while we verify your email address...
            </CardDescription>
          </>
        ) : verificationStatus === 'success' ? (
          <>
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">Email Verified!</CardTitle>
            <CardDescription className="text-center text-base">
              Your email has been verified successfully. You can now log in to your account.
            </CardDescription>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                {errorMessage?.includes("expired") ? (
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                ) : (
                  <X className="h-6 w-6 text-red-600" />
                )}
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">Verification Failed</CardTitle>
            <CardDescription className="text-center text-base">
              {errorMessage || "The verification link is invalid or has expired."}
            </CardDescription>
          </>
        )}
      </CardHeader>
      
      <CardFooter className="flex flex-col pt-4">
        {!isLoading && (
          verificationStatus === 'success' ? (
            <Link href="/login">
              <Button className="w-full">Go to Login</Button>
            </Link>
          ) : (
            <div className="space-y-2 w-full">
              <Link href="/login">
                <Button className="w-full">Go to Login</Button>
              </Link>
              <Link href="/">
                <Button className="w-full" variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          )
        )}
      </CardFooter>
    </Card>
  );
}
