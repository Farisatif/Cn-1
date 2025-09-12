import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk, DM_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { Header } from "@/components/navigation/header"
import { BreadcrumbNav } from "@/components/navigation/breadcrumb"
import { Footer } from "@/components/navigation/footer"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
})

export const metadata: Metadata = {
  title: "NextStep Navigator - Career Guidance Platform",
  description:
    "Discover your perfect career path with personalized guidance, resources, and expert insights for students, graduates, and professionals.",
  generator: "NextStep Navigator",
  keywords: "career guidance, career counseling, job search, education, professional development",
  viewport: "width=device-width, initial-scale=1",
  themeColor: "var(--primary)",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: "index, follow",
  openGraph: {
    title: "NextStep Navigator - Career Guidance Platform",
    description: "Discover your perfect career path with personalized guidance and expert insights.",
    type: "website",
    locale: "en_US",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${dmSans.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('ns_theme_v1');
                  if (!theme) {
                    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                    theme = prefersDark ? 'dark' : 'light';
                  }
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://vercel.live" />

        <style
          dangerouslySetInnerHTML={{
            __html: `
            :root {
              --font-space-grotesk: ${spaceGrotesk.style?.fontFamily || "Space Grotesk"}, system-ui, sans-serif;
              --font-dm-sans: ${dmSans.style?.fontFamily || "DM Sans"}, system-ui, sans-serif;
            }

            body {
              margin: 0;
              font-family: var(--font-dm-sans);
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
              background-color: var(--color-background);
              color: var(--color-foreground);
            }

            /* Critical CSS for above-the-fold content */
            .container {
              max-width: 1200px;
              margin-left: auto;
              margin-right: auto;
              padding-left: 1rem;
              padding-right: 1rem;
            }

            /* Loading states */
            .loading-skeleton {
              background: linear-gradient(90deg, var(--color-muted) 25%, var(--color-card) 50%, var(--color-muted) 75%);
              background-size: 200% 100%;
              animation: loading 1.5s infinite;
            }

            @keyframes loading {
              0% { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }

            /* Reduce layout shift */
            img, video {
              max-width: 100%;
              height: auto;
            }
          `,
          }}
        />
      </head>

      <body className="font-body min-h-screen flex flex-col">
        <a
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
          href="#main"
        >
          Skip to content
        </a>

        <Suspense fallback={<HeaderSkeleton />}>
          <Header />
        </Suspense>

        <Suspense fallback={null}>
          <BreadcrumbNav />
        </Suspense>

        <main id="main" className="flex-1">
          <Suspense fallback={<MainContentSkeleton />}>{children}</Suspense>
        </main>

        <Suspense fallback={null}>
          <Footer />
        </Suspense>

        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}

function HeaderSkeleton() {
  return (
    <header className="border-b sticky top-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2 text-sm border-b border-border/50">
          <div className="flex items-center space-x-4">
            <div className="h-3 w-20 loading-skeleton rounded"></div>
            <div className="h-3 w-24 loading-skeleton rounded"></div>
          </div>
          <div className="h-6 w-16 loading-skeleton rounded"></div>
        </div>
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 loading-skeleton rounded-xl"></div>
            <div className="h-6 w-32 loading-skeleton rounded"></div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="h-8 w-20 loading-skeleton rounded"></div>
            <div className="h-8 w-20 loading-skeleton rounded"></div>
          </div>
        </div>
      </div>
    </header>
  )
}

function MainContentSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start mb-16">
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-6">
              <div className="h-16 w-full loading-skeleton rounded-lg"></div>
              <div className="h-6 w-3/4 loading-skeleton rounded"></div>
            </div>
            <div className="h-12 w-full loading-skeleton rounded-lg"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 loading-skeleton rounded-xl"></div>
              ))}
            </div>
          </div>
          <div className="h-96 loading-skeleton rounded-xl"></div>
        </div>
      </div>
    </div>
  )
}
