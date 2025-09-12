"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

/**
 * Footer (Next.js) - Reworked to remove react-router usage and include
 * the same professional touches added to Header/Home:
 *  - Next.js Link (href) instead of react-router `to`
 *  - Accessible subscription flow with validation & live region
 *  - External social links open in new tab (noopener)
 *  - Small UX polish (success / error state, timeout to reset)
 *
 * Paste into: components/navigation/footer.tsx
 */

export function Footer() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"" | "idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")
    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address.")
      setStatus("error")
      return
    }

    setStatus("loading")
    try {
      // simulate small delay to show loading state
      await new Promise((r) => setTimeout(r, 450))

      const existing = JSON.parse(localStorage.getItem("subscribers") || "[]")
      const cleaned = email.trim().toLowerCase()
      if (!existing.includes(cleaned)) {
        existing.push(cleaned)
        localStorage.setItem("subscribers", JSON.stringify(existing))
      }

      setStatus("success")
      setEmail("")
      // reset to idle after a short confirmation
      setTimeout(() => setStatus("idle"), 3500)
    } catch {
      setErrorMessage("Subscription failed. Try again.")
      setStatus("error")
    }
  }

  const socialLinks = [
    { Icon: Facebook, href: "https://facebook.com/nextstepnavigator", label: "Facebook" },
    { Icon: Twitter, href: "https://twitter.com/nextstepnav", label: "Twitter" },
    { Icon: Linkedin, href: "https://linkedin.com/company/nextstep-navigator", label: "LinkedIn" },
    { Icon: Instagram, href: "https://instagram.com/nextstepnavigator", label: "Instagram" },
  ]

  const quickLinks = [
    { href: "/career-bank", label: "Career Bank" },
    { href: "/quiz", label: "Interest Quiz" },
    { href: "/multimedia", label: "Multimedia Guidance" },
    { href: "/stories", label: "Success Stories" },
    { href: "/resources", label: "Resource Library" },
  ]

  const supportLinks = [
    { href: "/contact", label: "Contact Us" },
    { href: "/about", label: "About Us" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/help", label: "Help Center" },
  ]

  return (
    <footer
      className="mt-auto"
      style={{
        background: "var(--background)",
        color: "var(--foreground)",
      }}
      aria-labelledby="footer-heading"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div
                className="h-8 w-8 rounded-lg flex items-center justify-center"
                style={{ background: "var(--accent)" }}
                aria-hidden
              >
                <TrendingUp className="h-5 w-5" style={{ color: "var(--accent-foreground)" }} />
              </div>

              <span className="font-heading font-bold text-xl" id="footer-heading">
                NextStep Navigator
              </span>
            </div>

            <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
              Empowering students, graduates, and professionals to discover their perfect career path through
              personalized guidance and comprehensive resources.
            </p>

            <div className="flex space-x-2" role="navigation" aria-label="social links">
              {socialLinks.map(({ Icon, href, label }, idx) => (
                <a
                  key={idx}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit our ${label} page`}
                  className="inline-flex items-center justify-center rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-offset-1"
                  style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold" style={{ color: "var(--accent)" }}>
              Quick Links
            </h3>

            <nav className="space-y-2 text-sm" aria-label="quick links">
              {quickLinks.map((link, idx) => (
                <Link key={idx} href={link.href} className="block">
                  <span
                    style={{ color: "var(--muted-foreground)" }}
                    className="transition-colors hover:text-[var(--foreground)]"
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold" style={{ color: "var(--accent)" }}>
              Support
            </h3>

            <div className="space-y-2 text-sm">
              {supportLinks.map((link, idx) => (
                <Link key={idx} href={link.href} className="block">
                  <span
                    style={{ color: "var(--muted-foreground)" }}
                    className="transition-colors hover:text-[var(--foreground)]"
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Info + Newsletter */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold" style={{ color: "var(--accent)" }}>
              Get in Touch
            </h3>

            <div className="space-y-3 text-sm" style={{ color: "var(--muted-foreground)" }}>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@nextstepnavigator.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>123 Career Street, Future City, FC 12345</span>
              </div>
            </div>

            {/* Newsletter signup */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm" style={{ color: "var(--accent)" }}>
                Stay Updated
              </h4>

              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 items-center">
                <label htmlFor="footer-email" className="sr-only">
                  Enter your email
                </label>

                <Input
                  id="footer-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-sm"
                  style={{
                    background: "var(--input)",
                    color: "var(--card-foreground)",
                    border: `1px solid var(--accent)`,
                  }}
                  aria-label="Enter your email to subscribe"
                />

                <Button
                  type="submit"
                  className="text-sm"
                  size="sm"
                  style={{
                    background: "var(--accent)",
                    color: "var(--accent-foreground)",
                    opacity: status === "loading" ? 0.8 : 1,
                    cursor: status === "loading" ? "not-allowed" : "pointer",
                  }}
                  aria-disabled={status === "loading"}
                >
                  {status === "loading" ? "Subscribing..." : "Subscribe"}
                </Button>
              </form>

              {/* Live region for screen readers */}
              <div aria-live="polite" aria-atomic="true" className="mt-1 min-h-[1.25rem]">
                {status === "success" && (
                  <div className="text-sm text-green-500" role="status">
                    Thanks — you’re subscribed!
                  </div>
                )}
                {status === "error" && errorMessage && (
                  <div className="text-sm text-red-500" role="alert">
                    {errorMessage}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div
          className="border-t mt-8 pt-8 text-center text-sm"
          style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
        >
          <p>
            &copy; {new Date().getFullYear()} NextStep Navigator. All rights reserved. Built with passion for career
            guidance.
          </p>
        </div>
      </div>
    </footer>
  )
}
