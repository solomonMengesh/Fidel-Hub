import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Mock user authentication state (replace with your actual logic)
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Courses", href: "/courses" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  // Get dashboard link based on user role
  const getDashboardLink = () => {
    if (!user) return "/login";

    switch (user.role) {
      case "student":
        return "/dashboard";
      case "instructor":
        return "/instructor";
      case "admin":
        return "/admin";
      default:
        return "/dashboard";
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return "U";

    const nameParts = user.fullName.split(" ");
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return user.fullName.substring(0, 2).toUpperCase();
  };

  // Log out the user
  const logout = () => {
    setUser(null); // Reset user state
    localStorage.removeItem("user"); // Remove from localStorage or handle other logout steps
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 px-6 md:px-8 transition-all duration-300 ease-in-out",
        isScrolled
          ? "py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-sm"
          : "py-5 bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="text-2xl font-display font-bold text-fidel-900 dark:text-white flex items-center"
        >
          <span className="bg-fidel-500 text-white h-8 w-8 rounded-lg flex items-center justify-center mr-2 shadow-lg">F</span>
          Fidel<span className="text-fidel-500">Hub</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                location.pathname === link.href
                  ? "text-fidel-600 bg-fidel-50 dark:bg-fidel-950/30"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full" size="icon">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-fidel-100 text-fidel-700 dark:bg-fidel-900 dark:text-fidel-300">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.fullName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to={getDashboardLink()} className="cursor-pointer w-full flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-500 focus:text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link to="/signup">
                <Button
                  className="bg-fidel-500 hover:bg-fidel-600 text-white shadow-sm hover:shadow-md transition-all duration-200"
                  size="sm"
                >
                  Sign up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg shadow-lg border-t border-gray-200 dark:border-slate-800 animate-fade-in">
          <div className="p-4 space-y-4">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    "px-3 py-2 rounded-md text-base font-medium transition-colors duration-200",
                    location.pathname === link.href
                      ? "text-fidel-500 bg-fidel-50 dark:bg-fidel-950/30"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200 dark:border-gray-800">
              {user ? (
                <>
                  <Link to={getDashboardLink()} className="w-full">
                    <Button variant="outline" className="w-full">Dashboard</Button>
                  </Link>
                  <Button
                    onClick={logout}
                    className="w-full bg-fidel-500 hover:bg-fidel-600 text-white"
                  >
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" className="w-full">
                    <Button variant="outline" className="w-full">Log in</Button>
                  </Link>
                  <Link to="/signup" className="w-full">
                    <Button className="w-full bg-fidel-500 hover:bg-fidel-600 text-white">Sign up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
