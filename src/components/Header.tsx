
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, Building, Info, Phone, Mail } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import EnquiryForm from "@/components/EnquiryForm";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const location = useLocation();
  
  const isAdminPage = location.pathname === '/admin-dashboard';

  const navItems = [
    { name: "Home", icon: Home, href: "/" },
    { name: "Active Listings", icon: Building, href: "/active-listings" },
    { name: "About Us", icon: Info, href: "/about" },
    { name: "Contact", icon: Phone, href: "/contact" },
  ];

  const isActiveRoute = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  const handleEnquirySubmit = (formData: any) => {
    console.log("Header enquiry submitted:", formData);
    setShowEnquiryModal(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 shadow-xl">
        {!isAdminPage && (
          <div className="bg-cyan-500/10 border-b border-cyan-500/20">
            <div className="container mx-auto px-4 py-1 text-center">
              <p className="text-cyan-400 text-sm font-medium">RERA ID: A011262501596</p>
            </div>
          </div>
        )}
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <img
              src="/favicon.png"
              alt="Logo"
              className="w-full h-full object-contain"
            />
            </div>
            <span className="text-xl font-bold text-white">TrueView Reality</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-1 transition-colors duration-200 ${
                  isActiveRoute(item.href)
                    ? "text-yellow-400 font-medium"
                    : "text-gray-200 hover:text-yellow-400"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}
            {!isAdminPage && (
              <Button
                onClick={() => setShowEnquiryModal(true)}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white"
              >
                <Mail className="w-4 h-4 mr-2" />
                Enquiry
              </Button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-200" />
            ) : (
              <Menu className="w-6 h-6 text-gray-200" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 transition-colors duration-200 ${
                    isActiveRoute(item.href)
                      ? "text-yellow-400 font-medium"
                      : "text-gray-200 hover:text-yellow-400"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
              {!isAdminPage && (
                <Button
                  onClick={() => {
                    setShowEnquiryModal(true);
                    setIsMenuOpen(false);
                  }}
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white self-start"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Enquiry
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>

    {/* Enquiry Modal */}
    <Dialog open={showEnquiryModal} onOpenChange={setShowEnquiryModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Property Enquiry</DialogTitle>
        </DialogHeader>
        <EnquiryForm 
          onSubmit={handleEnquirySubmit}
          onClose={() => setShowEnquiryModal(false)}
        />
      </DialogContent>
    </Dialog>
  </>
  );
};

export default Header;
