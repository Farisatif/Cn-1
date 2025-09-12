import { Routes, Route } from "react-router-dom"
import { Suspense } from "react"
import { Header } from "@/components/navigation/header"
import { BreadcrumbNav } from "@/components/navigation/breadcrumb"
import { Footer } from "@/components/navigation/footer"
import { Toaster } from "@/components/ui/toaster"
import HomePage from "@/pages/HomePage"
import AboutPage from "@/pages/AboutPage"
import AdmissionPage from "@/pages/AdmissionPage"
import BookmarksPage from "@/pages/BookmarksPage"
import CareerBankPage from "@/pages/CareerBankPage"
import CareerDetailPage from "@/pages/CareerDetailPage"

function App() {
  return (
    <div className="min-h-screen flex flex-col">
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
        <Suspense fallback={<MainContentSkeleton />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/admission" element={<AdmissionPage />} />
            <Route path="/bookmarks" element={<BookmarksPage />} />
            <Route path="/career-bank" element={<CareerBankPage />} />
            <Route path="/career-bank/:id" element={<CareerDetailPage />} />
          </Routes>
        </Suspense>
      </main>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>

      <Toaster />
    </div>
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

export default App
