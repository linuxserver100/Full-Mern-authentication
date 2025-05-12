import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Clock, Menu, User, Settings, LogOut } from "lucide-react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    return location === path;
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-6 w-6 text-primary-600" />
            <Link href="/">
              <a className="text-xl font-semibold text-gray-900 dark:text-white">Auth System</a>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/">
              <a className={`text-gray-600 hover:text-primary-500 transition-colors dark:text-gray-300 dark:hover:text-primary-400 ${isActive("/") ? "text-primary-500 dark:text-primary-400" : ""}`}>
                Home
              </a>
            </Link>
            <Link href="/about">
              <a className={`text-gray-600 hover:text-primary-500 transition-colors dark:text-gray-300 dark:hover:text-primary-400 ${isActive("/about") ? "text-primary-500 dark:text-primary-400" : ""}`}>
                About
              </a>
            </Link>
            <Link href="/contact">
              <a className={`text-gray-600 hover:text-primary-500 transition-colors dark:text-gray-300 dark:hover:text-primary-400 ${isActive("/contact") ? "text-primary-500 dark:text-primary-400" : ""}`}>
                Contact
              </a>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard">
                  <a className="hidden md:inline-block text-gray-600 hover:text-primary-500 transition-colors dark:text-gray-300 dark:hover:text-primary-400">
                    Dashboard
                  </a>
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      {user.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt={user.username}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium dark:bg-primary-900 dark:text-primary-300">
                          {user.firstName?.charAt(0) || user.username.charAt(0)}
                        </div>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link href="/profile">
                      <DropdownMenuItem className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/settings">
                      <DropdownMenuItem className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link href="/login">
                  <a className="text-gray-600 hover:text-primary-500 transition-colors dark:text-gray-300 dark:hover:text-primary-400">
                    Log in
                  </a>
                </Link>
                <Link href="/register">
                  <a>
                    <Button>Sign up</Button>
                  </a>
                </Link>
              </div>
            )}
            
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="grid gap-6 py-6">
                  <Link href="/">
                    <a className="text-lg font-semibold" onClick={closeMenu}>
                      Home
                    </a>
                  </Link>
                  <Link href="/about">
                    <a className="text-lg font-semibold" onClick={closeMenu}>
                      About
                    </a>
                  </Link>
                  <Link href="/contact">
                    <a className="text-lg font-semibold" onClick={closeMenu}>
                      Contact
                    </a>
                  </Link>
                  
                  {user ? (
                    <>
                      <div className="h-px bg-gray-200 dark:bg-gray-700" />
                      <Link href="/dashboard">
                        <a className="text-lg font-semibold" onClick={closeMenu}>
                          Dashboard
                        </a>
                      </Link>
                      <Link href="/profile">
                        <a className="text-lg font-semibold" onClick={closeMenu}>
                          Profile
                        </a>
                      </Link>
                      <Link href="/settings">
                        <a className="text-lg font-semibold" onClick={closeMenu}>
                          Settings
                        </a>
                      </Link>
                      <button 
                        className="text-lg font-semibold text-left text-red-500"
                        onClick={() => {
                          logout();
                          closeMenu();
                        }}
                      >
                        Log out
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="h-px bg-gray-200 dark:bg-gray-700" />
                      <Link href="/login">
                        <a className="text-lg font-semibold" onClick={closeMenu}>
                          Log in
                        </a>
                      </Link>
                      <Link href="/register">
                        <a onClick={closeMenu}>
                          <Button className="w-full">Sign up</Button>
                        </a>
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
