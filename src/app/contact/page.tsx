"use client";

import { useState } from "react";
import { Mail, Calendar, Check, Copy, ShieldCheck } from "lucide-react";

// Inline brand icon SVGs
const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

export default function ContactPage() {
  const [copied, setCopied] = useState(false);
  const email = "shashank@atthaluri.com";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const channels = [
    {
      name: "EMAIL DIRECT",
      value: email,
      icon: Mail,
      href: `mailto:${email}`,
      actionText: "SEND MAIL",
      canCopy: true,
    },
    {
      name: "SCHEDULING ROUTER",
      value: "cal.com/shashank-atthaluri",
      icon: Calendar,
      href: "https://cal.com", // Cal.com placeholder
      actionText: "BOOK SYNC",
      canCopy: false,
    },
    {
      name: "SOURCE CONTROL",
      value: "github.com/shashank-atthaluri",
      icon: GithubIcon,
      href: "https://github.com/shashank-atthaluri",
      actionText: "VIEW REPOS",
      canCopy: false,
    },
    {
      name: "PROFESSIONAL INDEX",
      value: "linkedin.com/in/shashank",
      icon: LinkedinIcon,
      href: "https://linkedin.com", // LinkedIn placeholder
      actionText: "CONNECT",
      canCopy: false,
    },
    {
      name: "TECHNICAL BROADCASTS",
      value: "x.com/shashank",
      icon: TwitterIcon,
      href: "https://x.com", // Twitter placeholder
      actionText: "FOLLOW",
      canCopy: false,
    },
  ];

  return (
    <div className="mx-auto max-w-2xl w-full px-6 py-16 md:py-24 space-y-12">
      {/* Header */}
      <div className="space-y-4 border-b border-border-subtle/50 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/20 bg-accent/5 text-[11px] font-mono text-accent tracking-wider font-semibold">
          <ShieldCheck className="h-3 w-3" />
          <span>ESTABLISH_COMM_LINE</span>
        </div>
        <h1 className="font-heading text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
          Secure Coordinates
        </h1>
        <p className="text-base text-text-muted leading-relaxed font-sans font-medium">
          Collaborating on systems design, AI workflows, and independent product building. Reach out through direct channels or schedule a calendar synchronization below.
        </p>
      </div>

      {/* Connection channels */}
      <div className="space-y-4">
        {channels.map((chan) => {
          const Icon = chan.icon;
          return (
            <div
              key={chan.name}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-xl border border-border-subtle/40 bg-card-bg/15 hover:border-accent/30 transition-all duration-200 gap-4"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="p-2 rounded-lg border border-border-subtle/70 bg-background text-text-muted shrink-0">
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0">
                  <span className="font-mono text-[9px] text-text-muted tracking-wider block font-bold">
                    {chan.name}
                  </span>
                  <span className="text-sm font-semibold text-foreground truncate block mt-0.5">
                    {chan.value}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {chan.canCopy && (
                  <button
                    onClick={handleCopyEmail}
                    className="p-2 rounded-lg border border-border-subtle/70 hover:border-accent/40 bg-background hover:bg-accent/5 text-text-muted hover:text-foreground transition-all"
                    title="Copy address to clipboard"
                  >
                    {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
                  </button>
                )}
                <a
                  href={chan.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20 hover:border-accent text-xs font-mono font-bold transition-all text-center"
                >
                  {chan.actionText}
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer secure hash */}
      <div className="flex items-center gap-2 text-[10px] font-mono text-text-muted/65 border-t border-border-subtle/30 pt-6">
        <span>SECURITY_KEY: 7f4d2f8e1a6b0c3d9e8f7a6b5c4d3e2f</span>
      </div>
    </div>
  );
}
