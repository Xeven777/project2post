"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  SearchIcon,
  StarIcon,
  GitForkIcon,
  ClockIcon,
  LinkedinIcon,
  TwitterIcon,
  BookOpenIcon,
  CodeIcon,
  EyeIcon,
  LockIcon,
  ArrowRightIcon,
  FilterIcon,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

// Mock data for repositories
const mockRepositories = [
  {
    id: "1",
    name: "project-management-app",
    description: "A full-stack project management application with real-time updates",
    language: "TypeScript",
    stars: 48,
    forks: 12,
    updatedAt: "2 days ago",
    isPrivate: false,
  },
  {
    id: "2",
    name: "e-commerce-platform",
    description: "Modern e-commerce platform built with Next.js and Stripe integration",
    language: "JavaScript",
    stars: 32,
    forks: 8,
    updatedAt: "1 week ago",
    isPrivate: true,
  },
  {
    id: "3",
    name: "ai-image-generator",
    description: "AI-powered image generation tool using stable diffusion models",
    language: "Python",
    stars: 156,
    forks: 23,
    updatedAt: "3 days ago",
    isPrivate: false,
  },
  {
    id: "4",
    name: "blockchain-voting-system",
    description: "Secure voting system built on blockchain technology",
    language: "Solidity",
    stars: 89,
    forks: 15,
    updatedAt: "2 weeks ago",
    isPrivate: false,
  },
  {
    id: "5",
    name: "personal-portfolio",
    description: "My personal portfolio website showcasing projects and skills",
    language: "JavaScript",
    stars: 12,
    forks: 3,
    updatedAt: "1 month ago",
    isPrivate: false,
  },
  {
    id: "6",
    name: "react-component-library",
    description: "A collection of reusable React components with Storybook documentation",
    language: "TypeScript",
    stars: 67,
    forks: 14,
    updatedAt: "5 days ago",
    isPrivate: false,
  },
  {
    id: "7",
    name: "data-visualization-dashboard",
    description: "Interactive data visualization dashboard using D3.js and React",
    language: "JavaScript",
    stars: 41,
    forks: 9,
    updatedAt: "2 weeks ago",
    isPrivate: false,
  },
  {
    id: "8",
    name: "mobile-fitness-app",
    description: "React Native fitness tracking application with health metrics",
    language: "TypeScript",
    stars: 28,
    forks: 6,
    updatedAt: "3 weeks ago",
    isPrivate: true,
  },
]

// Language color mapping
const languageColors = {
  TypeScript: "bg-blue-500",
  JavaScript: "bg-yellow-500",
  Python: "bg-green-500",
  Solidity: "bg-purple-500",
  Ruby: "bg-red-500",
  Go: "bg-cyan-500",
  Rust: "bg-orange-500",
  Java: "bg-amber-500",
  Kotlin: "bg-pink-500",
  Swift: "bg-indigo-500",
  default: "bg-gray-500",
}

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [sortBy, setSortBy] = useState("updated")

  // Filter repositories based on search query and active tab
  const filteredRepos = mockRepositories.filter((repo) => {
    const matchesSearch =
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.description.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "public") return matchesSearch && !repo.isPrivate
    if (activeTab === "private") return matchesSearch && repo.isPrivate

    return matchesSearch
  })

  // Sort repositories
  const sortedRepos = [...filteredRepos].sort((a, b) => {
    if (sortBy === "stars") return b.stars - a.stars
    if (sortBy === "forks") return b.forks - a.forks
    if (sortBy === "name") return a.name.localeCompare(b.name)
    // Default: sort by updated
    return 0 // In a real app, we'd parse dates
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header with gradient border bottom */}
        <div className="relative pb-6 mb-8">
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent"></div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold">Your GitHub Repositories</h1>
              <p className="text-zinc-400 mt-1">Select a repository to generate social media posts</p>
            </div>
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10 border-2 border-blue-500/20">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                <AvatarFallback className="bg-blue-950 text-blue-200">JD</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">Jane Developer</div>
                <div className="text-xs text-zinc-400">jane@example.com</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
              <Input
                className="pl-10 bg-zinc-900/50 border-zinc-800 text-white"
                placeholder="Search repositories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] bg-zinc-900/50 border-zinc-800 text-white">
                  <FilterIcon className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                  <SelectItem value="updated">Recently Updated</SelectItem>
                  <SelectItem value="stars">Most Stars</SelectItem>
                  <SelectItem value="forks">Most Forks</SelectItem>
                  <SelectItem value="name">Alphabetical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Repository Tabs */}
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-zinc-900/50 border border-zinc-800 p-1">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md"
              >
                All Repositories
              </TabsTrigger>
              <TabsTrigger
                value="public"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md"
              >
                Public
              </TabsTrigger>
              <TabsTrigger
                value="private"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md"
              >
                Private
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Repository Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedRepos.map((repo) => (
            <Card
              key={repo.id}
              className="bg-zinc-900/70 border-zinc-800 hover:border-blue-500/50 transition-all duration-300 overflow-hidden group"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>

              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="space-y-1.5">
                    <div className="flex items-center">
                      <BookOpenIcon className="h-4 w-4 mr-2 text-blue-400" />
                      <CardTitle className="text-xl font-bold text-blue-400 group-hover:text-blue-300 transition-colors">
                        {repo.name}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-zinc-400 line-clamp-2">{repo.description}</CardDescription>
                  </div>
                  {repo.isPrivate ? (
                    <Badge variant="outline" className="bg-zinc-800 text-zinc-400 border-zinc-700 flex items-center">
                      <LockIcon className="h-3 w-3 mr-1" />
                      Private
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-zinc-800 text-zinc-400 border-zinc-700 flex items-center">
                      <EyeIcon className="h-3 w-3 mr-1" />
                      Public
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pb-2">
                <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
                  {repo.language && (
                    <div className="flex items-center">
                      <div
                        className={`h-3 w-3 rounded-full mr-1.5 ${
                          languageColors[repo.language] || languageColors.default
                        }`}
                      ></div>
                      {repo.language}
                    </div>
                  )}
                  <div className="flex items-center">
                    <StarIcon className="h-4 w-4 mr-1 text-yellow-500" />
                    {repo.stars}
                  </div>
                  <div className="flex items-center">
                    <GitForkIcon className="h-4 w-4 mr-1 text-green-500" />
                    {repo.forks}
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1 text-blue-500" />
                    {repo.updatedAt}
                  </div>
                </div>
              </CardContent>

              <Separator className="bg-zinc-800 my-2" />

              <CardFooter className="pt-2">
                <div className="w-full space-y-2">
                  <div className="text-xs text-zinc-500 mb-1">Generate post for:</div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link href={`/generate/${repo.id}?platform=linkedin`}>
                      <Button
                        variant="outline"
                        className="w-full bg-zinc-800/50 border-zinc-700 hover:border-blue-500 hover:bg-blue-950/30 text-zinc-300 hover:text-blue-300 transition-all"
                      >
                        <LinkedinIcon className="h-4 w-4 mr-2 text-blue-500" />
                        LinkedIn
                      </Button>
                    </Link>
                    <Link href={`/generate/${repo.id}?platform=twitter`}>
                      <Button
                        variant="outline"
                        className="w-full bg-zinc-800/50 border-zinc-700 hover:border-blue-500 hover:bg-blue-950/30 text-zinc-300 hover:text-blue-300 transition-all"
                      >
                        <TwitterIcon className="h-4 w-4 mr-2 text-blue-400" />X / Twitter
                      </Button>
                    </Link>
                  </div>
                  <Link href={`/repo/${repo.id}`}>
                    <Button variant="ghost" className="w-full text-xs text-zinc-500 hover:text-zinc-300">
                      View Repository Details
                      <ArrowRightIcon className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {sortedRepos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-zinc-800 rounded-lg bg-zinc-900/30 text-center">
            <CodeIcon className="h-12 w-12 text-zinc-700 mb-4" />
            <h3 className="text-xl font-medium text-zinc-300 mb-2">No repositories found</h3>
            <p className="text-zinc-500 max-w-md mb-6">
              {searchQuery
                ? `No repositories matching "${searchQuery}" were found. Try a different search term.`
                : "Connect your GitHub account to see your repositories here."}
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">Refresh Repositories</Button>
          </div>
        )}
      </div>
    </div>
  )
}
