import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Helmet } from "react-helmet";

export default function About() {
  return (
    <div className="flex min-h-screen flex-col">
      <Helmet>
        <title>About | Authentication System</title>
        <meta name="description" content="Learn about our comprehensive authentication system and its features." />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow">
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl font-bold mb-6 text-center">About Our Authentication System</h1>
              
              <div className="prose prose-lg mx-auto">
                <p className="lead">
                  Our comprehensive authentication system provides a secure and user-friendly way to manage user access to your applications.
                </p>
                
                <h2>Our Mission</h2>
                <p>
                  We believe that security should be accessible to everyone. Our mission is to provide a robust authentication system that is easy to integrate and use, while maintaining the highest security standards.
                </p>
                
                <h2>Key Features</h2>
                <ul>
                  <li>
                    <strong>Multiple Login Options</strong> - Email/password login, social login integrations with major providers including Google, GitHub, Microsoft, LinkedIn, Facebook, and Apple.
                  </li>
                  <li>
                    <strong>Email Verification</strong> - Ensure users provide valid email addresses with a verification process.
                  </li>
                  <li>
                    <strong>Two-Factor Authentication</strong> - Add an extra layer of security with TOTP-based two-factor authentication compatible with popular authenticator apps.
                  </li>
                  <li>
                    <strong>Password Management</strong> - Secure password hashing, password reset flows, and password change functionality.
                  </li>
                  <li>
                    <strong>Profile Management</strong> - Allow users to update their profile information and manage their account settings.
                  </li>
                  <li>
                    <strong>Session Management</strong> - Track active sessions and allow users to log out from specific devices.
                  </li>
                </ul>
                
                <h2>Security Commitment</h2>
                <p>
                  Security is our top priority. Our system implements industry best practices including:
                </p>
                <ul>
                  <li>Secure password hashing with bcrypt</li>
                  <li>JWT token-based authentication</li>
                  <li>HTTPS-only communication</li>
                  <li>Session tracking for suspicious activity detection</li>
                  <li>Email notifications for important account activities</li>
                  <li>Two-factor authentication options</li>
                </ul>
                
                <h2>Our Team</h2>
                <p>
                  Our team consists of experienced security professionals and developers who are passionate about creating secure authentication solutions. We continuously monitor the latest security trends and update our system to address potential vulnerabilities.
                </p>
                
                <h2>Get Started</h2>
                <p>
                  Ready to implement our authentication system in your application? Sign up for an account and follow our comprehensive documentation to get started quickly.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
