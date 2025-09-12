"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  DollarSign,
  TrendingUp,
  GraduationCap,
  Users,
  Bookmark,
  BookmarkCheck,
  Share2,
  FileText,
  Lightbulb,
  Target,
  BookOpen,
} from "lucide-react"

interface Career {
  id: string
  title: string
  industry: string
  description: string
  skills: string[]
  education: string[]
  salaryRange: {
    min: number
    max: number
    currency: string
  }
  image: string
  tags: string[]
  level: string[]
  growthRate: string
  jobOutlook: string
}

export default function CareerDetailPage() {
  const params = useParams()
  const navigate = useNavigate()
  const [career, setCareer] = useState<Career | null>(null)
  const [relatedCareers, setRelatedCareers] = useState<Career[]>([])
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [personalNote, setPersonalNote] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadCareerData = async () => {
      try {
        const response = await fetch("/data/careers.json")
        const careers: Career[] = await response.json()
        const currentCareer = careers.find((c) => c.id === params.id)

        if (currentCareer) {
          setCareer(currentCareer)

          // Find related careers (same industry, different career)
          const related = careers
            .filter((c) => c.industry === currentCareer.industry && c.id !== currentCareer.id)
            .slice(0, 3)
          setRelatedCareers(related)

          // Check if bookmarked
          const bookmarks = JSON.parse(localStorage.getItem("bookmarkedCareers") || "[]")
          setIsBookmarked(bookmarks.includes(currentCareer.id))

          // Load personal note
          const notes = JSON.parse(localStorage.getItem("careerNotes") || "{}")
          setPersonalNote(notes[currentCareer.id] || "")

          // Mark as viewed
          const viewed = JSON.parse(localStorage.getItem("viewedCareers") || "[]")
          if (!viewed.includes(currentCareer.id)) {
            const newViewed = [...viewed, currentCareer.id]
            localStorage.setItem("viewedCareers", JSON.stringify(newViewed))
          }
        }
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to load career data:", error)
        setIsLoading(false)
      }
    }

    if (params.id) {
      loadCareerData()
    }
  }, [params.id])

  const toggleBookmark = () => {
    if (!career) return

    const bookmarks = JSON.parse(localStorage.getItem("bookmarkedCareers") || "[]")
    const newBookmarks = isBookmarked ? bookmarks.filter((id: string) => id !== career.id) : [...bookmarks, career.id]

    localStorage.setItem("bookmarkedCareers", JSON.stringify(newBookmarks))
    setIsBookmarked(!isBookmarked)
  }

  const saveNote = () => {
    if (!career) return

    const notes = JSON.parse(localStorage.getItem("careerNotes") || "{}")
    notes[career.id] = personalNote
    localStorage.setItem("careerNotes", JSON.stringify(notes))
  }

  const shareCareer = async () => {
    if (!career) return

    const shareData = {
      title: `${career.title} - NextStep Navigator`,
      text: `Check out this career opportunity: ${career.title}`,
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading career details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!career) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Career Not Found</h1>
          <p className="text-muted-foreground mb-6">The career you're looking for doesn't exist.</p>
          <Link to="/career-bank">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Career Bank
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/career-bank">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Career Bank
          </Button>
        </Link>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={shareCareer}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={toggleBookmark}>
            {isBookmarked ? (
              <>
                <BookmarkCheck className="h-4 w-4 mr-2 text-primary" />
                Bookmarked
              </>
            ) : (
              <>
                <Bookmark className="h-4 w-4 mr-2" />
                Bookmark
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Career Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">{career.title}</CardTitle>
                  <CardDescription className="flex items-center space-x-2">
                    <Badge variant="secondary">{career.industry}</Badge>
                    <span>•</span>
                    <span>{career.jobOutlook}</span>
                  </CardDescription>
                </div>
                <img
                  src={career.image || "/placeholder.svg"}
                  alt={career.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{career.description}</p>
            </CardContent>
          </Card>

          {/* Key Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Salary Range</p>
                    <p className="text-sm text-muted-foreground">
                      ${career.salaryRange.min.toLocaleString()} - ${career.salaryRange.max.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Growth Rate</p>
                    <p className="text-sm text-muted-foreground">{career.growthRate} annually</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Skills Required */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Skills Required</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {career.skills.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Education Path */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5" />
                <span>Education Path</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {career.education.map((edu, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm">{edu}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Personal Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Personal Notes</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="note">Add your thoughts about this career</Label>
                <Textarea
                  id="note"
                  placeholder="What interests you about this career? What questions do you have?"
                  value={personalNote}
                  onChange={(e) => setPersonalNote(e.target.value)}
                  rows={4}
                />
              </div>
              <Button onClick={saveNote} size="sm">
                Save Note
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/quiz" className="block">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Take Interest Quiz
                </Button>
              </Link>
              <Link to="/resources" className="block">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Find Resources
                </Button>
              </Link>
              <Link to="/stories" className="block">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Users className="h-4 w-4 mr-2" />
                  Read Success Stories
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Related Careers */}
          {relatedCareers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Related Careers</CardTitle>
                <CardDescription>Other opportunities in {career.industry}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {relatedCareers.map((relatedCareer) => (
                  <Link key={relatedCareer.id} to={`/career-bank/${relatedCareer.id}`}>
                    <div className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <h4 className="font-medium text-sm mb-1">{relatedCareer.title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">{relatedCareer.description}</p>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Career Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Career Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {career.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
