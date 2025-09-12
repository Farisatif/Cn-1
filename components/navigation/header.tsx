"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  TrendingUp,
  Clock,
  MapPin,
  Menu,
  User,
  GraduationCap,
  Users,
  Briefcase,
  Search,
  BookOpen,
  Video,
  Star,
  Library,
  Phone,
  Info,
  LogIn,
  FileText,
  MessageSquare,
  LogOut,
  Sun,
  Moon,
  Bell,
  Settings,
  Github,
  Zap,
  EyeOff,
  Eye,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface NavigationItem {
  title: string
  href: string
  description: string
  icon: React.ReactNode
  userTypes: string[]
}

const navigationItems: NavigationItem[] = [
  {
    title: "Career Bank",
    href: "/career-bank",
    description: "Explore career profiles and opportunities",
    icon: <Search className="h-4 w-4" />,
    userTypes: ["student", "graduate", "professional"],
  },
  {
    title: "Interest Quiz",
    href: "/quiz",
    description: "Discover careers that match your interests",
    icon: <BookOpen className="h-4 w-4" />,
    userTypes: ["student", "graduate", "professional"],
  },
  {
    title: "Multimedia Guidance",
    href: "/multimedia",
    description: "Videos and podcasts from professionals",
    icon: <Video className="h-4 w-4" />,
    userTypes: ["student", "graduate", "professional"],
  },
  {
    title: "Success Stories",
    href: "/stories",
    description: "Inspiring journeys from professionals",
    icon: <Star className="h-4 w-4" />,
    userTypes: ["student", "graduate", "professional"],
  },
  {
    title: "Resource Library",
    href: "/resources",
    description: "Articles, eBooks, and guides",
    icon: <Library className="h-4 w-4" />,
    userTypes: ["student", "graduate", "professional"],
  },
  {
    title: "Admission & Coaching",
    href: "/admission",
    description: "Study abroad and interview tips",
    icon: <GraduationCap className="h-4 w-4" />,
    userTypes: ["student", "graduate"],
  },
]

/* -------------------------
   safe localStorage helpers (SSR-safe)
   ------------------------- */
const safeLocalGet = <T,>(key: string, fallback: T): T => {
  try {
    if (typeof window === "undefined") return fallback
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

const safeLocalSet = (key: string, value: any) => {
  try {
    if (typeof window === "undefined") return
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore
  }
}

const LS_KEYS = {
  THEME: "ns_theme_v1",
  VISIT: "ns_session_visits_v1",
  NOTIFS: "ns_notifications_v1",
  USERS: "ns_users_v1",
  AUTH: "ns_auth_v1",
}

/* -------------------------
   Header component
   ------------------------- */
export function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const pathname = location?.pathname || "/"

  const [userName, setUserName] = useState("")
  const [userType, setUserType] = useState("")
  const [currentTime, setCurrentTime] = useState("")
  const [locationLabel, setLocationLabel] = useState("")
  const [visitorCount, setVisitorCount] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const [darkMode, setDarkMode] = useState<boolean>(() => safeLocalGet<boolean>(LS_KEYS.THEME, false))
  const [notifications, setNotifications] = useState<{ id: string; text: string; read: boolean }[]>(
    () =>
      safeLocalGet<{ id: string; text: string; read: boolean }[]>(LS_KEYS.NOTIFS, [
        { id: "n1", text: "New career added: Data Strategist", read: false },
        { id: "n2", text: "Your quiz results are ready", read: false },
      ]),
  )

  const [searchTerm, setSearchTerm] = useState("")
  const [showNotifications, setShowNotifications] = useState(false)
  const searchRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    // apply theme class and persist (SSR-safe)
    try {
      if (typeof document !== "undefined") {
        if (darkMode) document.documentElement.classList.add("dark")
        else document.documentElement.classList.remove("dark")
      }
      safeLocalSet(LS_KEYS.THEME, darkMode)
    } catch {
      // noop
    }
  }, [darkMode])

  useEffect(() => {
    if (typeof window === "undefined") return
    const storedUserName = localStorage.getItem("userName")
    const storedUserType = localStorage.getItem("userType")
    const authToken = localStorage.getItem(LS_KEYS.AUTH)

    if (storedUserName) setUserName(storedUserName)
    if (storedUserType) setUserType(storedUserType)
    if (authToken) setIsAuthenticated(true)
  }, [])

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleString())
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (typeof navigator !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => setLocationLabel("Your Location"),
        () => setLocationLabel("Location unavailable"),
      )
    } else {
      setLocationLabel("Geolocation not supported")
    }
  }, [])

  useEffect(() => {
    const baseCount = 15847
    const sessionVisits = Number(safeLocalGet<number>(LS_KEYS.VISIT, 0))
    safeLocalSet(LS_KEYS.VISIT, sessionVisits + 1)
    const randomized = baseCount + sessionVisits + Math.floor(Math.random() * 50)
    setVisitorCount(randomized)
  }, [])

  useEffect(() => {
    // persist notifications if they change
    safeLocalSet(LS_KEYS.NOTIFS, notifications)
  }, [notifications])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement)?.tagName
      if (targetTag === "INPUT" || targetTag === "TEXTAREA") return
      if (e.key === "/" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        searchRef.current?.focus()
      } else if (e.key === "Escape") {
        setIsMobileMenuOpen(false)
        setShowAuthModal(false)
        setShowNotifications(false)
        searchRef.current?.blur()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  const handleLogin = (email: string, password: string) => {
    const users = safeLocalGet<any[]>(LS_KEYS.USERS, [])
    const user = users.find((u) => u.email === email && u.password === password)
    if (user) {
      safeLocalSet(LS_KEYS.AUTH, "token_simulated")
      safeLocalSet("userName", user.name)
      safeLocalSet("userType", user.userType)
      setUserName(user.name)
      setUserType(user.userType)
      setIsAuthenticated(true)
      setShowAuthModal(false)
      navigate("/dashboard")
      return { success: true }
    } else {
      return { success: false, error: "Invalid email or password" }
    }
  }

  const handleSignup = (name: string, email: string, password: string, uType: string) => {
    const users = safeLocalGet<any[]>(LS_KEYS.USERS, [])
    const existingUser = users.find((u) => u.email === email)

    if (existingUser) {
      return { success: false, error: "Email already exists" }
    }

    const newUser = { id: Date.now(), name, email, password, userType: uType }
    users.push(newUser)
    safeLocalSet(LS_KEYS.USERS, users)
    safeLocalSet(LS_KEYS.AUTH, "token_simulated")
    safeLocalSet("userName", name)
    safeLocalSet("userType", uType)
    setUserName(name)
    setUserType(uType)
    setIsAuthenticated(true)
    setShowAuthModal(false)
    navigate("/dashboard")
    return { success: true }
  }

  const handleLogout = () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(LS_KEYS.AUTH)
        localStorage.removeItem("userName")
        localStorage.removeItem("userType")
      }
    } catch {}
    setUserName("")
    setUserType("")
    setIsAuthenticated(false)
    navigate("/")
  }

  const markNotificationRead = (id: string) => {
    const next = notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    setNotifications(next)
    safeLocalSet(LS_KEYS.NOTIFS, next)
  }

  const clearNotifications = () => {
    const next = notifications.map((n) => ({ ...n, read: true }))
    setNotifications(next)
    safeLocalSet(LS_KEYS.NOTIFS, next)
  }

  const getUserTypeIcon = () => {
    switch (userType) {
      case "student":
        return <GraduationCap className="h-4 w-4 text-primary" />
      case "graduate":
        return <Users className="h-4 w-4 text-primary" />
      case "professional":
        return <Briefcase className="h-4 w-4 text-primary" />
      default:
        return <User className="h-4 w-4 text-primary" />
    }
  }

  const getFilteredNavItems = useCallback(() => {
    if (!userType) return navigationItems
    return navigationItems.filter((item) => item.userTypes.includes(userType))
  }, [userType])

  const searchSuggestions = navigationItems
    .map((i) => ({ label: i.title, href: i.href }))
    .concat([
      { label: "Resume Guidelines", href: "/resume" },
      { label: "Interview Tips", href: "/interview" },
    ])

  const onSearchSelect = (href: string) => {
    setSearchTerm("")
    navigate(href)
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <>
      <header className="border-b sticky top-0 z-50 bg-background/80 backdrop-blur-md" role="banner">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex items-center justify-between py-2 text-xs sm:text-sm border-b border-border/50">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2" aria-hidden>
                <Clock className="h-3 w-3 text-primary" />
                <span className="hidden sm:inline text-muted-foreground font-medium">{currentTime}</span>
              </div>

              <div className="flex items-center space-x-2" aria-hidden>
                <MapPin className="h-3 w-3 text-primary" />
                <span className="hidden lg:inline text-muted-foreground">{locationLabel}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Badge
                variant="secondary"
                className="text-xs px-2 bg-primary/10 text-primary border-primary/20"
                aria-live="polite"
              >
                <Users className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">Visitors: </span>
                {visitorCount.toLocaleString()}
              </Badge>

              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNotifications((s) => !s)}
                  className="p-2 h-auto relative"
                  aria-label={`${unreadCount} unread notifications`}
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground font-medium">
                      {unreadCount}
                    </span>
                  )}
                </Button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-popover border border-border rounded-lg shadow-lg p-4 z-50">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">Notifications</h3>
                      <Button variant="ghost" size="sm" onClick={clearNotifications} className="text-xs">
                        Mark all read
                      </Button>
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {notifications.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No notifications</p>}
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-2 rounded text-sm cursor-pointer transition-colors ${notif.read ? "text-muted-foreground" : "bg-primary/5 text-foreground"}`}
                          onClick={() => markNotificationRead(notif.id)}
                        >
                          {notif.text}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {isAuthenticated && userName && (
                <div className="flex items-center space-x-2 text-primary">
                  {getUserTypeIcon()}
                  <span className="hidden md:inline text-xs font-medium">{`Hi, ${userName.split(" ")[0]}`}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between py-3 sm:py-4">
            <Link to="/" className="flex items-center space-x-3" aria-label="NextStep Navigator home">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-heading font-bold text-xl text-foreground">
                <span className="hidden sm:inline">NextStep Navigator</span>
                <span className="sm:hidden">NextStep</span>
              </span>
            </Link>

            <div className="flex-1 mx-6 hidden lg:flex items-center gap-6">
              <div className="relative w-1/2">
                <Label htmlFor="global-search" className="sr-only">
                  Search the site
                </Label>
                <Input
                  id="global-search"
                  ref={searchRef}
                  placeholder="Search (press /) — e.g. Interest Quiz"
                  className="w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchTerm.trim()) {
                      navigate(`/career-bank?search=${encodeURIComponent(searchTerm.trim())}`)
                      setSearchTerm("")
                    }
                  }}
                />
                {searchTerm && (
                  <div className="absolute left-0 top-full mt-2 w-full rounded-lg shadow-lg bg-popover border border-border z-50">
                    <ul role="listbox" className="max-h-60 overflow-auto p-2">
                      {searchSuggestions
                        .filter((s) => s.label.toLowerCase().includes(searchTerm.toLowerCase()))
                        .slice(0, 6)
                        .map((s) => (
                          <li key={s.href}>
                            <button onClick={() => onSearchSelect(s.href)} className="w-full text-left p-3 rounded-md hover:bg-muted transition-colors">
                              {s.label}
                            </button>
                          </li>
                        ))}
                      {searchSuggestions.filter((s) => s.label.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                        <li className="p-3 text-sm text-muted-foreground">No suggestions found</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              <NavigationMenu className="hidden lg:flex">
                <NavigationMenuList>
                  {getFilteredNavItems()
                    .slice(0, 4)
                    .map((item) => (
                      <NavigationMenuItem key={item.href}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={item.href}
                            className={cn(
                              "group inline-flex h-10 items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground",
                              pathname === item.href && "bg-muted text-foreground",
                            )}
                          >
                            <span className="mr-2 text-primary">{item.icon}</span>
                            {item.title}
                          </Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    ))}

                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="hover:bg-muted hover:text-foreground">More</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid gap-3 p-6 w-[500px]">
                        {[
                          {
                            href: "/bookmarks",
                            icon: BookOpen,
                            title: "My Bookmarks",
                            desc: "Saved careers and notes",
                          },
                          {
                            href: "/resume",
                            icon: FileText,
                            title: "Resume Guidelines",
                            desc: "Professional resume writing tips",
                          },
                          {
                            href: "/interview",
                            icon: MessageSquare,
                            title: "Interview Tips",
                            desc: "Master your interview skills",
                          },
                          { href: "/contact", icon: Phone, title: "Contact Us", desc: "Get in touch with our team" },
                          { href: "/about", icon: Info, title: "About Us", desc: "Learn about our mission" },
                        ].map((link) => (
                          <Link key={link.href} to={link.href} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors">
                            <link.icon className="h-5 w-5 text-primary" />
                            <div>
                              <div className="font-medium">{link.title}</div>
                              <div className="text-sm text-muted-foreground">{link.desc}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3">
              <Button variant="ghost" size="sm" onClick={() => setDarkMode((d) => !d)} className="p-2 h-auto" aria-label="Toggle theme">
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>

              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="hidden md:flex">
                      <User className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">{userName}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="flex items-center">
                        <Settings className="h-4 w-4 mr-2" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="flex items-center text-destructive">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden sm:flex"
                    onClick={() => {
                      setAuthMode("login")
                      setShowAuthModal(true)
                    }}
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Button>

                  <Button
                    size="sm"
                    className="hidden sm:flex bg-primary hover:bg-primary/90"
                    onClick={() => {
                      setAuthMode("signup")
                      setShowAuthModal(true)
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen((s) => !s)}
                className="p-2 h-auto lg:hidden"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <nav className="lg:hidden border-t border-border bg-background/95 backdrop-blur-sm" aria-label="Mobile navigation">
            <div className="container mx-auto px-4 py-4 space-y-3">
              <div className="relative">
                <Input placeholder="Search careers, skills..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>

              {getFilteredNavItems().map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="block py-3 px-4 rounded-lg hover:bg-muted transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-primary">{item.icon}</span>
                    <div>
                      <div className="font-medium">{item.title}</div>
                      <div className="text-xs text-muted-foreground">{item.description}</div>
                    </div>
                  </div>
                </Link>
              ))}

              {!isAuthenticated && (
                <div className="flex gap-3 pt-3 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => {
                      setAuthMode("login")
                      setShowAuthModal(true)
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    <LogIn className="h-4 w-4 mr-2" /> Login
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-primary hover:bg-primary/90"
                    onClick={() => {
                      setAuthMode("signup")
                      setShowAuthModal(true)
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </nav>
        )}
      </header>

      {(showNotifications || isMobileMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowNotifications(false)
            setIsMobileMenuOpen(false)
          }}
        />
      )}

      {showAuthModal && (
        <AuthModal mode={authMode} setAuthMode={setAuthMode} onClose={() => setShowAuthModal(false)} onLogin={handleLogin} onSignup={handleSignup} />
      )}
    </>
  )
}

/* -------------------------
   Auth Modal (same as before, unchanged API)
   ------------------------- */
function AuthModal({
  mode,
  setAuthMode,
  onClose,
  onLogin,
  onSignup,
}: {
  mode: "login" | "signup"
  setAuthMode?: (m: "login" | "signup") => void
  onClose: () => void
  onLogin: (email: string, password: string) => { success: boolean; error?: string }
  onSignup: (name: string, email: string, password: string, userType: string) => { success: boolean; error?: string }
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    userType: "student",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setError(null)
    setFormData((f) => ({ ...f, password: "" }))
  }, [mode])

  const validate = () => {
    if (mode === "signup") {
      if (!formData.name.trim()) return "Please enter your name."
      if (formData.name.trim().length < 2) return "Name must be at least 2 characters."
      if (!formData.email.includes("@") || !formData.email.includes(".")) return "Please provide a valid email."
      if (formData.password.length < 6) return "Password should be at least 6 characters."
    } else {
      if (!formData.email || !formData.password) return "Please enter email and password."
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsLoading(true)
    setError(null)

    await new Promise((resolve) => setTimeout(resolve, 500))

    try {
      let result
      if (mode === "login") {
        result = onLogin(formData.email, formData.password)
      } else {
        result = onSignup(formData.name, formData.email, formData.password, formData.userType)
      }

      if (!result.success && result.error) {
        setError(result.error)
      }
    } catch {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-xl p-6 bg-popover border border-border shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-heading font-bold">{mode === "login" ? "Welcome back" : "Create your account"}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close" className="p-2 h-auto">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button variant="outline" onClick={() => alert("GitHub OAuth integration coming soon!")} className="flex items-center justify-center gap-2">
            <Github className="h-4 w-4" /> GitHub
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setFormData({ name: "Demo User", email: "demo@nextstep.com", password: "demo123", userType: "student" })
              alert("Demo credentials filled! Click 'Sign in' to continue.")
            }}
            className="flex items-center justify-center gap-2"
          >
            <Zap className="h-4 w-4" /> Demo
          </Button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-popover px-2 text-muted-foreground">Or continue with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Full name</Label>
              <Input required className="h-11" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Enter your full name" />
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-sm font-medium">Email</Label>
            <Input required type="email" className="h-11" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Enter your email" />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Password</Label>
            <div className="relative">
              <Input required type={showPassword ? "text" : "password"} className="h-11 pr-10" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Enter your password" />
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 h-auto">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {mode === "signup" && <p className="text-xs text-muted-foreground">Must be at least 6 characters long</p>}
          </div>

          {mode === "signup" && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">I am a</Label>
              <select className="w-full h-11 px-3 rounded-md border border-border bg-background" value={formData.userType} onChange={(e) => setFormData({ ...formData, userType: e.target.value })}>
                <option value="student">Student</option>
                <option value="graduate">Graduate</option>
                <option value="professional">Professional</option>
              </select>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <Button type="submit" className="w-full h-11 bg-primary hover:bg-primary/90" disabled={isLoading}>
            {isLoading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
          </Button>

          <div className="text-center">
            <Button type="button" variant="ghost" onClick={() => setAuthMode?.(mode === "login" ? "signup" : "login")} className="text-sm">
              {mode === "login" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </Button>
          </div>
        </form>

        <p className="mt-4 text-xs text-muted-foreground text-center">
          By continuing, you agree to our <Link to="/terms" className="underline">Terms</Link> and{" "}
          <Link to="/privacy" className="underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  )
}
