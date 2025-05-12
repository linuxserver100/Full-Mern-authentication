import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { Helmet } from "react-helmet";

export default function ForgotPassword() {
  return (
    <div className="auth-layout">
      <Helmet>
        <title>Forgot Password | Authentication System</title>
        <meta name="description" content="Reset your password to regain access to your account." />
      </Helmet>
      
      <Navbar />
      
      <main className="auth-container">
        <div className="auth-form-container">
          <ForgotPasswordForm />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
