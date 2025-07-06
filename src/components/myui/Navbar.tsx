"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "../ui/button";
import { Menu, MessageSquare, X } from "lucide-react";

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#0B0F1A]/80 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <span
                className="text-xl font-semibold text-gray-200 
                 group-hover:text-cyan-400 transition-colors duration-300"
              >
                Umessage
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            </Link>
          </div>

       
          <div className="hidden md:flex items-center gap-8">
            {["/dashboard", "/profile", "/about"].map((path, i) => (
              <Link
                key={i}
                href={path}
                className="relative py-1 text-sm text-gray-300 hover:text-white 
                       font-medium transition-colors duration-200 group"
              >
                {path.replace("/", "").charAt(0).toUpperCase() + path.slice(2)}
                <span
                  className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r 
                            from-blue-400 to-purple-400 scale-x-0 group-hover:scale-x-100 
                            transition-transform duration-300 origin-left"
                />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
         
            {session ? (
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 
                          bg-white/5 rounded-full border border-white/10"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-sm text-gray-400">Welcome,</span>{" "}
                <span className="text-sm font-medium text-white truncate max-w-[100px] sm:max-w-none">
                  {user?.username || user?.name || user?.email?.split("@")[0]}
                </span>
              </div>
            ) : (
              <div
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 
                          bg-white/5 rounded-full border border-white/10"
              >
                <div className="w-2 h-2 rounded-full bg-gray-500" />
                <span className="text-sm text-gray-400">Guest</span>
              </div>
            )}

          
            <div className="hidden md:block">
              {session ? (
                <Button
                  onClick={() => signOut()}
                  className="bg-white/5 hover:bg-white/10 text-gray-300 
                         hover:text-white border border-white/10 rounded-lg 
                         px-4 py-2 text-sm transition-colors duration-200"
                >
                  Sign out
                </Button>
              ) : (
                <Link href="/sign-in">
                  <Button
                    className="bg-white/5 hover:bg-white/10 text-gray-300 
                           hover:text-white border border-white/10 rounded-lg 
                           px-4 py-2 text-sm transition-colors duration-200"
                  >
                    Sign in
                  </Button>
                </Link>
              )}
            </div>

          
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/5 
                     text-gray-400 hover:text-white transition-colors duration-200"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

      
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            menuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-3 space-y-1">
            {[
              { path: "/", label: "Home" },
              { path: "/dashboard", label: "Dashboard" },
              { path: "/profile", label: "Profile" },
              { path: "/about", label: "About" },
            ].map((item, i) => (
              <Link
                key={i}
                href={item.path}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 text-gray-300 hover:text-white 
                         hover:bg-white/5 rounded-lg transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}

            <div className="px-4 pt-2 pb-3">
              <div className="h-px bg-white/10" />
            </div>

            <div className="px-4">
              {session ? (
                <Button
                  onClick={() => {
                    setMenuOpen(false);
                    signOut();
                  }}
                  className="w-full bg-white/5 hover:bg-white/10 text-gray-300 
                         hover:text-white border border-white/10 rounded-lg 
                         py-2 text-sm transition-colors duration-200"
                >
                  Sign out
                </Button>
              ) : (
                <Link
                  href="/sign-in"
                  onClick={() => setMenuOpen(false)}
                  className="block w-full"
                >
                  <Button
                    className="w-full bg-white/5 hover:bg-white/10 text-gray-300 
                           hover:text-white border border-white/10 rounded-lg 
                           py-2 text-sm transition-colors duration-200"
                  >
                    Sign in
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
