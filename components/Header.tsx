"use client";

import { useState, useEffect } from "react";
import { Menu, X, MessageSquare, Github, Plus } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Dashboard", href: "#dashboard" },
    { name: "Projects", href: "#projects" },
    { name: "Analytics", href: "#analytics" },
    { name: "Settings", href: "#settings" },
  ];

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "border-b border-gray-200 bg-white/95 shadow-lg backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-2">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent">
              CommHub
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="group relative px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:text-blue-600"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
                </a>
              ))}
            </div>
          </div>

          {/* Desktop CTA */}
          <div className="hidden items-center space-x-4 md:flex">
           
            <button className="flex items-center space-x-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:shadow-lg">
              <Plus className="h-4 w-4" />
              <span>New Project</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-700 hover:text-blue-600"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="mt-2 space-y-1 rounded-lg border border-gray-200 bg-white px-2 pb-3 pt-2 shadow-lg">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-gray-700 transition-colors duration-200 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="border-t border-gray-200 pt-2">
                <button className="flex w-full items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:shadow-lg">
                  <Plus className="h-4 w-4" />
                  <span>New Project</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
