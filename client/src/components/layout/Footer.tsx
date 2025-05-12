import { Link } from "wouter";
import { Clock, Mail, GitPullRequest, Linkedin, Twitter } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="h-6 w-6 text-primary-500" />
              <span className="text-xl font-semibold text-white">Auth System</span>
            </div>
            <p className="mb-4">A comprehensive authentication system with multiple login options, email verification, and 2FA support.</p>
            <div className="flex space-x-4">
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <GitPullRequest size={20} />
                <span className="sr-only">GitPullRequest</span>
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Linkedin size={20} />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="hover:text-white transition-colors">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/login">
                  <a className="hover:text-white transition-colors">Login</a>
                </Link>
              </li>
              <li>
                <Link href="/register">
                  <a className="hover:text-white transition-colors">Register</a>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <a className="hover:text-white transition-colors">About</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="hover:text-white transition-colors">Contact</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms">
                  <a className="hover:text-white transition-colors">Terms of Service</a>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <a className="hover:text-white transition-colors">Privacy Policy</a>
                </Link>
              </li>
              <li>
                <Link href="/cookies">
                  <a className="hover:text-white transition-colors">Cookie Policy</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                <a href="mailto:support@authsystem.com" className="hover:text-white transition-colors">
                  support@authsystem.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-700 text-sm text-gray-400">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>© {currentYear} Auth System. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy">
                <a className="hover:text-white transition-colors">Privacy Policy</a>
              </Link>
              <Link href="/terms">
                <a className="hover:text-white transition-colors">Terms of Service</a>
              </Link>
              <Link href="/cookies">
                <a className="hover:text-white transition-colors">Cookie Policy</a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
