import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/navigation/header"
import { BreadcrumbNav } from "@/components/navigation/breadcrumb"
import { Footer } from "@/components/navigation/footer"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "@/components/ui/sonner"

// Import pages
import HomePage from "@/src/pages/HomePage"
import CareerBankPage from "@/src/pages/CareerBankPage"
import CareerDetailPage from "@/src/pages/CareerDetailPage"
import BookmarksPage from "@/src/pages/BookmarksPage"
import NotFound from "@/app/not-found"
import ResumePage from "@/app/resume/page"

// Import CSS
import "@/app/globals.css"

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <a
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
            href="#main"
          >
            Skip to content
          </a>

          <Header />
          <BreadcrumbNav />

          <main id="main" className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/career-bank" element={<CareerBankPage />} />
              <Route path="/career-bank/:id" element={<CareerDetailPage />} />
              <Route path="/bookmarks" element={<BookmarksPage />} />
              <Route path="/resume" element={<ResumePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
          <Toaster />
          <SonnerToaster />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
