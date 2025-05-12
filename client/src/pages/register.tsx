import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Helmet } from "react-helmet";

export default function Register() {
  return (
    <div className="auth-layout">
      <Helmet>
        <title>Create Account | Authentication System</title>
        <meta name="description" content="Create a new account to access all features of our application." />
      </Helmet>
      
      <Navbar />
      
      <main className="auth-container">
        <div className="auth-form-container">
          <RegisterForm />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
