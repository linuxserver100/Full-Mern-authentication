import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { VerifyEmailComponent } from "@/components/auth/VerifyEmail";
import { Helmet } from "react-helmet";

export default function VerifyEmail() {
  return (
    <div className="auth-layout">
      <Helmet>
        <title>Verify Email | Authentication System</title>
        <meta name="description" content="Verify your email address to complete your registration." />
      </Helmet>
      
      <Navbar />
      
      <main className="auth-container">
        <div className="auth-form-container">
          <VerifyEmailComponent />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
