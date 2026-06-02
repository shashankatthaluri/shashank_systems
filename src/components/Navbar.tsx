"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search } from "lucide-react";
import CommandPalette from "./CommandPalette";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [modifierKey, setModifierKey] = useState("⌘");
  const pathname = usePathname();

  // Detect OS for command palette shortcut display
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isMac = navigator.userAgent.toUpperCase().indexOf("MAC") >= 0;
      setModifierKey(isMac ? "⌘" : "Ctrl+");
    }
  }, []);

  // Handle scroll trigger for borders/shadows
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Listen for Ctrl+K / Cmd+K global shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navLinks = [
    { name: "Work", path: "/work" },
    { name: "Philosophy", path: "/philosophy" },
    { name: "Systems", path: "/systems" },
    { name: "Writing", path: "/writing" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "border-b border-border-subtle bg-background/80 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-6 md:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group font-heading text-lg font-bold tracking-tight text-foreground"
          >
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse group-hover:scale-125 transition-transform" />
            <span className="font-mono text-xs tracking-wider text-text-muted group-hover:text-foreground transition-colors">
              SHASHANK.SYSTEMS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.path || pathname.startsWith(link.path + "/");
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`text-sm font-medium tracking-wide transition-colors ${
                    isActive
                      ? "text-accent font-semibold"
                      : "text-text-muted hover:text-foreground"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Menu */}
          <div className="hidden md:flex items-center gap-4">
            {/* Search/Palette Trigger */}
            <button
              onClick={() => setIsPaletteOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-subtle/60 hover:border-accent/40 bg-card-bg/40 text-text-muted hover:text-foreground transition-all text-xs font-mono"
              title="Search command palette"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Search</span>
              <kbd className="bg-border-subtle px-1 rounded text-[10px] text-text-muted/80">{modifierKey}K</kbd>
            </button>
            <Link
              href="/now"
              className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-all ${
                pathname === "/now"
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border-subtle hover:border-accent/30 text-text-muted hover:text-foreground bg-border-subtle/10"
              }`}
            >
              /now
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setIsPaletteOpen(true)}
              className="p-2 rounded-lg border border-border-subtle bg-card-bg text-text-muted hover:text-foreground transition-all"
            >
              <Search className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg border border-border-subtle bg-card-bg text-text-muted hover:text-foreground transition-all"
            >
              {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="md:hidden border-b border-border-subtle bg-background/95 backdrop-blur-xl px-6 py-4 space-y-3">
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => {
                const isActive = pathname === link.path || pathname.startsWith(link.path + "/");
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`text-base py-1.5 transition-colors ${
                      isActive ? "text-accent font-semibold" : "text-text-muted"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <Link
                href="/now"
                onClick={() => setIsOpen(false)}
                className={`text-base py-1.5 transition-colors ${
                  pathname === "/now" ? "text-accent font-semibold" : "text-text-muted"
                }`}
              >
                /now (Current Focus)
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Command Palette Overlay */}
      <CommandPalette isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} />
    </>
  );
}
