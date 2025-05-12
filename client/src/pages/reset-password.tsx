import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { Helmet } from "react-helmet";

export default function ResetPassword() {
  return (
    <div className="auth-layout">
      <Helmet>
        <title>Reset Password | Authentication System</title>
        <meta name="description" content="Create a new password for your account." />
      </Helmet>
      
      <Navbar />
      
      <main className="auth-container">
        <div className="auth-form-container">
          <ResetPasswordForm />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
