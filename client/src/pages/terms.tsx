import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Helmet } from "react-helmet";

export default function Terms() {
  return (
    <>
      <Helmet>
        <title>Terms of Service - Auth System</title>
        <meta
          name="description"
          content="Terms of Service for the Auth System application."
        />
      </Helmet>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
            
            <div className="prose prose-blue max-w-none">
              <p className="text-lg mb-4">Last updated: May 12, 2025</p>
              
              <h2>1. Introduction</h2>
              <p>
                Welcome to Auth System. These Terms of Service govern your use of our website and services.
                By accessing or using the Auth System, you agree to be bound by these Terms.
              </p>
              
              <h2>2. Accounts</h2>
              <p>
                When you create an account with us, you must provide accurate, complete, and current information.
                You are responsible for safeguarding your password and for all activities that occur under your account.
              </p>
              
              <h2>3. User Conduct</h2>
              <p>
                You agree not to use the Auth System for any illegal or unauthorized purpose.
                You agree to comply with all local laws regarding online conduct and acceptable content.
              </p>
              
              <h2>4. Intellectual Property</h2>
              <p>
                The Auth System and its original content, features, and functionality are owned by the company
                and are protected by international copyright, trademark, patent, trade secret, and other intellectual
                property or proprietary rights laws.
              </p>
              
              <h2>5. Termination</h2>
              <p>
                We may terminate or suspend your account immediately, without prior notice or liability,
                for any reason, including breach of these Terms.
              </p>
              
              <h2>6. Limitation of Liability</h2>
              <p>
                In no event shall the company be liable for any indirect, incidental, special, consequential or
                punitive damages, including without limitation, loss of profits, data, use, goodwill, or other
                intangible losses.
              </p>
              
              <h2>7. Changes to Terms</h2>
              <p>
                We reserve the right to modify or replace these Terms at any time. It is your responsibility
                to review these Terms periodically for changes.
              </p>
              
              <h2>8. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at support@authsystem.com.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}