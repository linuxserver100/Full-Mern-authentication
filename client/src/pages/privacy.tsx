import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Helmet } from "react-helmet";

export default function Privacy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - Auth System</title>
        <meta
          name="description"
          content="Privacy Policy for the Auth System application."
        />
      </Helmet>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
            
            <div className="prose prose-blue max-w-none">
              <p className="text-lg mb-4">Last updated: May 12, 2025</p>
              
              <h2>1. Information We Collect</h2>
              <p>
                We collect information you provide directly to us when you register for an account, 
                update your profile, or communicate with us. This may include your name, email address, 
                phone number, and any other information you choose to provide.
              </p>
              
              <h2>2. How We Use Your Information</h2>
              <p>
                We use the information we collect to provide, maintain, and improve our services, 
                to process and complete transactions, and to send you related information including 
                confirmations, security alerts, and support messages.
              </p>
              
              <h2>3. Information Sharing</h2>
              <p>
                We do not share your personal information with third parties except as described in this 
                privacy policy. We may share your information with service providers who perform services on our behalf, 
                to comply with laws, or in connection with a merger, sale of company assets, financing, or acquisition.
              </p>
              
              <h2>4. Security</h2>
              <p>
                We take reasonable measures to help protect your personal information from loss, theft, 
                misuse and unauthorized access, disclosure, alteration and destruction.
              </p>
              
              <h2>5. Your Choices</h2>
              <p>
                You may update, correct, or delete your account information at any time by logging into your account. 
                If you wish to delete your account, please contact us at support@authsystem.com.
              </p>
              
              <h2>6. Cookies and Similar Technologies</h2>
              <p>
                We use cookies and similar technologies to track your interactions with our services, 
                to help personalize your experience, and to help us understand how people use our services.
              </p>
              
              <h2>7. Changes to This Privacy Policy</h2>
              <p>
                We may change this privacy policy from time to time. If we make changes, 
                we will notify you by revising the date at the top of the policy.
              </p>
              
              <h2>8. Contact Us</h2>
              <p>
                If you have any questions about this privacy policy, please contact us at support@authsystem.com.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}