import React from 'react';
import { Button } from '../ui/Button';

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center">
              <img 
                src="/Hewlett-Packard-Enterprise-Logo-1.png" 
                alt="HPE Logo" 
                className="h-8 w-auto"
              />
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-[#01A982] transition-colors">Products</a>
              <a href="#" className="text-gray-600 hover:text-[#01A982] transition-colors">Solutions</a>
              <a href="#" className="text-gray-600 hover:text-[#01A982] transition-colors">Services</a>
              <a href="#" className="text-gray-600 hover:text-[#01A982] transition-colors">Support</a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">Sign In</Button>
            <Button size="sm">Contact Sales</Button>
          </div>
        </div>
      </div>
    </header>
  );
}