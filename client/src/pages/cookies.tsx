import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Helmet } from "react-helmet";

export default function Cookies() {
  return (
    <>
      <Helmet>
        <title>Cookie Policy - Auth System</title>
        <meta
          name="description"
          content="Cookie Policy for the Auth System application."
        />
      </Helmet>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Cookie Policy</h1>
            
            <div className="prose prose-blue max-w-none">
              <p className="text-lg mb-4">Last updated: May 12, 2025</p>
              
              <h2>1. What Are Cookies</h2>
              <p>
                Cookies are small pieces of text sent to your web browser by a website you visit. 
                A cookie file is stored in your web browser and allows the Service or a third-party 
                to recognize you and make your next visit easier and the Service more useful to you.
              </p>
              
              <h2>2. How We Use Cookies</h2>
              <p>
                We use cookies for the following purposes:
              </p>
              <ul>
                <li>Authentication – We use cookies to identify you when you visit our website and as you navigate our website.</li>
                <li>Security – We use cookies as an element of the security measures used to protect user accounts.</li>
                <li>Analysis – We use cookies to help us analyze the use and performance of our website and services.</li>
                <li>Personalization – We use cookies to store information about your preferences and to personalize the website for you.</li>
              </ul>
              
              <h2>3. Types of Cookies We Use</h2>
              <p>
                We use both session and persistent cookies on the Service and we use different types 
                of cookies to run the Service:
              </p>
              <ul>
                <li><strong>Essential cookies.</strong> These are cookies that are required for the operation of our website.</li>
                <li><strong>Analytical/performance cookies.</strong> These allow us to recognize and count the number of visitors and to see how visitors move around our website when they are using it.</li>
                <li><strong>Functionality cookies.</strong> These are used to recognize you when you return to our website.</li>
                <li><strong>Targeting cookies.</strong> These cookies record your visit to our website, the pages you have visited and the links you have followed.</li>
              </ul>
              
              <h2>4. Your Choices Regarding Cookies</h2>
              <p>
                If you prefer to avoid the use of cookies on the website, first you must disable 
                the use of cookies in your browser and then delete the cookies saved in your browser 
                associated with this website. You may use this option for preventing the use of cookies at any time.
              </p>
              
              <h2>5. Changes to This Cookie Policy</h2>
              <p>
                We may update our Cookie Policy from time to time. We will notify you of any changes 
                by posting the new Cookie Policy on this page.
              </p>
              
              <h2>6. Contact Us</h2>
              <p>
                If you have any questions about this Cookie Policy, please contact us at support@authsystem.com.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}