import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LoginForm } from "@/components/auth/LoginForm";
import { Helmet } from "react-helmet";

export default function Login() {
  return (
    <div className="auth-layout">
      <Helmet>
        <title>Log In | Authentication System</title>
        <meta name="description" content="Log in to your account to access the dashboard and manage your profile." />
      </Helmet>
      
      <Navbar />
      
      <main className="auth-container">
        <div className="auth-form-container">
          <LoginForm />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
