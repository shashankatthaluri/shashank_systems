import type { Metadata } from "next";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Shashank Atthaluri | Systems Product Engineer",
    template: "%s | Shashank Atthaluri"
  },
  description: "Building operational systems, lifecycle infrastructure, and offline-first databases for AI-native software.",
  keywords: ["Systems Product Engineer", "Operational Systems Architect", "AI Infrastructure", "Lifecycle Orchestration", "Offline Sync", "Shashank Atthaluri"],
  openGraph: {
    title: "Shashank Atthaluri | Systems Product Engineer",
    description: "Building operational systems, lifecycle infrastructure, and offline-first databases for AI-native software.",
    url: "https://shashank.atthaluri.com",
    siteName: "Shashank Atthaluri Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shashank Atthaluri | Systems Product Engineer",
    description: "Building operational systems, lifecycle infrastructure, and offline-first databases for AI-native software.",
    creator: "@shashank_atthaluri"
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-accent/30 selection:text-white">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <footer className="border-t border-border-subtle/50 py-8 px-6 md:px-8 mt-auto bg-background">
          <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono text-text-muted">
            <div>
              <span>© {new Date().getFullYear()} SHASHANK ATTHALURI. LOCAL-FIRST SOFTWARE LAB.</span>
            </div>
            <div className="flex gap-6">
              <a href="https://github.com/shashank-atthaluri" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                GITHUB
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                LINKEDIN
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                TWITTER
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
