import React from 'react';
import { Activity, Mail, Phone, MapPin, Twitter, Linkedin, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-white">
              <Activity className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold tracking-tight">DischargeX</span>
            </Link>
            <p className="mt-4 text-sm leading-6">
              Simplifying hospital workflows with AI-powered discharge summaries. Smart, instant, and professional.
            </p>
            <div className="mt-6 flex space-x-4">
              <Twitter className="h-5 w-5 cursor-pointer hover:text-blue-400" />
              <Linkedin className="h-5 w-5 cursor-pointer hover:text-blue-400" />
              <Github className="h-5 w-5 cursor-pointer hover:text-blue-400" />
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Product</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/product" className="hover:text-white">Features</Link></li>
              <li><Link to="/dashboard" className="hover:text-white">Demo</Link></li>
              <li><a href="#" className="hover:text-white">Pricing</a></li>
              <li><a href="#" className="hover:text-white">Security</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Company</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-white">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Support</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> support@dischargex.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> +91 98765 43210
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> HealthTech Park, Bangalore, India
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-slate-800 pt-8 text-center text-xs">
          <p>© {new Date().getFullYear()} DischargeX. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
