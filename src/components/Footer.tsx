
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Home, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminLogin from "./AdminLogin";

const Footer = () => {
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin-dashboard';
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { toast } = useToast();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubscribing(true);
    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert([{ email: email.trim() }]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Already subscribed",
            description: "This email is already subscribed to our newsletter.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Successfully subscribed!",
          description: "You'll receive our latest property updates.",
        });
        setEmail("");
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast({
        title: "Subscription failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white border-t border-cyan-500/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/25">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">TrueView Reality</span>
            </div>
            <p className="text-gray-300 mb-4">
              Experience the future of real estate with cutting-edge technology and personalized service that makes property dreams come true.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-gray-400 hover:text-cyan-400 cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 text-gray-400 hover:text-cyan-400 cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 text-gray-400 hover:text-cyan-400 cursor-pointer transition-colors" />
              <Linkedin className="w-5 h-5 text-gray-400 hover:text-cyan-400 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-cyan-400">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-300 hover:text-cyan-400 transition-colors">Home</a></li>
              <li><a href="#listings" className="text-gray-300 hover:text-cyan-400 transition-colors">Active Listings</a></li>
              <li><a href="#about" className="text-gray-300 hover:text-cyan-400 transition-colors">About Us</a></li>
              <li><a href="#contact" className="text-gray-300 hover:text-cyan-400 transition-colors">Contact</a></li>
              <li><a href="#services" className="text-gray-300 hover:text-cyan-400 transition-colors">Services</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-cyan-400">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-cyan-400" />
                <span className="text-gray-300">+91 9106-111-222</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-cyan-400" />
                <span className="text-gray-300">info@trueviewrealtyindia.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-cyan-400" />
                <span className="text-gray-300">Level 2, Cyberpark, IT City Road, Indore (MP) - 452001</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-cyan-400">Stay Updated</h3>
            <p className="text-gray-300 mb-4">
              Subscribe to get updates on new properties and market insights.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-slate-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20"
              />
              <Button 
                type="submit" 
                disabled={isSubscribing}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 shadow-lg shadow-cyan-500/25 disabled:opacity-50"
              >
                {isSubscribing ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          {!isAdminPage && (
            <div className="mb-4 text-center">
              <p className="text-cyan-400 font-medium">RERA ID: A011262501596</p>
            </div>
          )}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-center md:text-left">
              © 2024 TrueView Reality. All rights reserved. | Privacy Policy | Terms of Service
            </p>
            {!isAdminPage && <AdminLogin showTrigger={true} />}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
