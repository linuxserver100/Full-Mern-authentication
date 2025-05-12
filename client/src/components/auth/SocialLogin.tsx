import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { 
  FaGoogle, 
  FaGithub, 
  FaMicrosoft, 
  FaLinkedin, 
  FaFacebook, 
  FaApple 
} from 'react-icons/fa';
import { useToast } from "@/hooks/use-toast";

export function SocialLogin() {
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSocialLogin = async (provider: string) => {
    setLoading(provider);
    
    try {
      // In a real implementation, we would redirect to the OAuth provider
      // using window.location.href = `/api/auth/${provider}`
      
      // For this demo, we'll just show a toast
      toast({
        title: "Social Login",
        description: `${provider} login is not implemented in this demo.`,
      });
    } catch (error) {
      toast({
        title: "Login Failed",
        description: `Could not initialize ${provider} login.`,
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-3">
      <Button
        variant="outline"
        className="flex items-center justify-center gap-2"
        onClick={() => handleSocialLogin('google')}
        disabled={loading !== null}
      >
        {loading === 'google' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FaGoogle className="h-4 w-4 text-red-500" />
        )}
        <span className="sr-only sm:not-sr-only sm:text-xs">Google</span>
      </Button>
      
      <Button
        variant="outline"
        className="flex items-center justify-center gap-2"
        onClick={() => handleSocialLogin('github')}
        disabled={loading !== null}
      >
        {loading === 'github' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FaGithub className="h-4 w-4" />
        )}
        <span className="sr-only sm:not-sr-only sm:text-xs">GitHub</span>
      </Button>
      
      <Button
        variant="outline"
        className="flex items-center justify-center gap-2"
        onClick={() => handleSocialLogin('microsoft')}
        disabled={loading !== null}
      >
        {loading === 'microsoft' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FaMicrosoft className="h-4 w-4 text-blue-500" />
        )}
        <span className="sr-only sm:not-sr-only sm:text-xs">Microsoft</span>
      </Button>
      
      <Button
        variant="outline"
        className="flex items-center justify-center gap-2"
        onClick={() => handleSocialLogin('linkedin')}
        disabled={loading !== null}
      >
        {loading === 'linkedin' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FaLinkedin className="h-4 w-4 text-blue-600" />
        )}
        <span className="sr-only sm:not-sr-only sm:text-xs">LinkedIn</span>
      </Button>
      
      <Button
        variant="outline"
        className="flex items-center justify-center gap-2"
        onClick={() => handleSocialLogin('facebook')}
        disabled={loading !== null}
      >
        {loading === 'facebook' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FaFacebook className="h-4 w-4 text-blue-700" />
        )}
        <span className="sr-only sm:not-sr-only sm:text-xs">Facebook</span>
      </Button>
      
      <Button
        variant="outline"
        className="flex items-center justify-center gap-2"
        onClick={() => handleSocialLogin('apple')}
        disabled={loading !== null}
      >
        {loading === 'apple' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FaApple className="h-4 w-4" />
        )}
        <span className="sr-only sm:not-sr-only sm:text-xs">Apple</span>
      </Button>
    </div>
  );
}
