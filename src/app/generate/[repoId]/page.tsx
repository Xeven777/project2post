"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Loader2,
  Copy,
  ArrowLeft,
  RefreshCw,
  LinkedinIcon,
  TwitterIcon,
  BookOpenIcon,
  CodeIcon,
  PackageIcon,
  GitBranchIcon,
  CheckIcon,
  Share2Icon,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Mock repository data
const mockRepositories = {
  "1": {
    id: "1",
    name: "project-management-app",
    description: "A full-stack project management application with real-time updates",
    language: "TypeScript",
    readme:
      "# Project Management App\n\nA real-time project management tool built with React, Node.js, and Socket.IO.\n\n## Features\n\n- Real-time task updates\n- Team collaboration tools\n- File sharing and version control\n- Gantt chart for project timeline\n- Customizable dashboards\n\n## Technologies\n\n- React with TypeScript\n- Node.js and Express\n- MongoDB for data storage\n- Socket.IO for real-time updates\n- AWS S3 for file storage",
    packageJson: {
      dependencies: {
        react: "^18.2.0",
        next: "^14.0.0",
        typescript: "^5.0.0",
        tailwindcss: "^3.3.0",
        "socket.io-client": "^4.6.0",
        axios: "^1.3.0",
        "date-fns": "^2.29.0",
      },
    },
  },
  "2": {
    id: "2",
    name: "e-commerce-platform",
    description: "Modern e-commerce platform built with Next.js and Stripe integration",
    language: "JavaScript",
    readme:
      "# E-commerce Platform\n\nA modern e-commerce solution with Next.js and Stripe.\n\n## Features\n\n- Product catalog with search and filtering\n- User accounts and order history\n- Secure checkout with Stripe\n- Admin dashboard for inventory management\n- Analytics and reporting\n\n## Technologies\n\n- Next.js for frontend and API routes\n- Stripe for payment processing\n- MongoDB for data storage\n- NextAuth.js for authentication\n- Vercel for deployment",
    packageJson: {
      dependencies: {
        react: "^18.2.0",
        next: "^14.0.0",
        stripe: "^12.0.0",
        "next-auth": "^4.20.0",
        mongodb: "^5.0.0",
        swr: "^2.1.0",
        tailwindcss: "^3.3.0",
      },
    },
  },
}

// Mock generated posts
const mockGeneratedPosts = {
  linkedin: {
    "1": [
      {
        id: "post1",
        content:
          "🚀 Excited to share my latest project: Project Management App!\n\nI've built a real-time project management tool that helps teams collaborate more effectively with features like:\n\n✅ Real-time task updates\n✅ Team collaboration tools\n✅ File sharing and version control\n✅ Gantt charts for project timelines\n✅ Customizable dashboards\n\nTech stack:\n• React with TypeScript\n• Node.js and Express\n• MongoDB\n• Socket.IO for real-time updates\n• AWS S3 for file storage\n\nCheck it out: github.com/janedeveloper/project-management-app\n\n#WebDevelopment #React #NodeJS #RealTime #ProjectManagement",
      },
      {
        id: "post2",
        content:
          "I'm thrilled to announce the launch of my new Project Management App! 🎉\n\nAfter months of development, I've created a tool that solves the challenges of remote team collaboration through real-time updates and intuitive interfaces.\n\nKey features include real-time task tracking, team collaboration tools, file sharing with version control, and visual project timelines.\n\nBuilt with React, TypeScript, Node.js, MongoDB, and Socket.IO for real-time functionality.\n\nLooking for beta testers and feedback!\n\n#SoftwareDevelopment #ProductLaunch #RemoteWork #ProjectManagement",
      },
      {
        id: "post3",
        content:
          "💡 Problem: Team collaboration tools are often disconnected from project management systems.\n\n🛠️ Solution: I built a Project Management App that integrates real-time collaboration with comprehensive project tracking.\n\nThe application features:\n• Instant task updates across team members\n• Integrated file sharing with version history\n• Visual project timelines with Gantt charts\n• Customizable dashboards for different roles\n\nTech stack: React, TypeScript, Node.js, MongoDB, Socket.IO, and AWS S3.\n\nWhat collaboration challenges does your team face?\n\n#ProductDevelopment #TeamCollaboration #SoftwareEngineering #ReactJS",
      },
    ],
    "2": [
      {
        id: "post1",
        content:
          "🛍️ Just launched: A modern E-commerce Platform built with Next.js!\n\nI've developed a complete e-commerce solution featuring:\n\n✅ Responsive product catalog with search and filtering\n✅ User accounts and order tracking\n✅ Secure checkout with Stripe integration\n✅ Admin dashboard for inventory management\n✅ Detailed analytics and reporting\n\nTech stack:\n• Next.js for frontend and API routes\n• Stripe for payment processing\n• MongoDB for data storage\n• NextAuth.js for authentication\n• Deployed on Vercel\n\n#Ecommerce #WebDevelopment #NextJS #JavaScript #FullStack",
      },
    ],
  },
  twitter: {
    "1": [
      {
        id: "tweet1",
        content:
          "🚀 Just shipped: A real-time project management app built with React, Node.js, and Socket.IO!\n\nFeatures real-time updates, team collaboration, and visual timelines.\n\nCheck it out: github.com/janedeveloper/project-management-app\n\n#WebDev #React #NodeJS",
      },
      {
        id: "tweet2",
        content:
          "After months of work, I've launched my Project Management App with real-time collaboration features!\n\nBuilt with React, TypeScript, Node.js, MongoDB, and Socket.IO.\n\nLooking for beta testers! DM if interested.\n\n#SoftwareDev #ProductLaunch",
      },
    ],
    "2": [
      {
        id: "tweet1",
        content:
          "🛍️ Just launched: E-commerce platform with Next.js and Stripe!\n\nFeatures:\n- Product catalog with search\n- User accounts\n- Secure checkout\n- Admin dashboard\n\n#WebDev #NextJS #JavaScript #Ecommerce",
      },
    ],
  },
}

// Post tone options
const toneOptions = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "technical", label: "Technical" },
  { value: "enthusiastic", label: "Enthusiastic" },
  { value: "informative", label: "Informative" },
]

export default function GeneratePostPage() {
  const { repoId } = useParams()
  const searchParams = useSearchParams()
  const platform = searchParams.get("platform") || "linkedin"
  const router = useRouter()
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [repository, setRepository] = useState(null)
  const [generatedPosts, setGeneratedPosts] = useState([])
  const [selectedPost, setSelectedPost] = useState(null)
  const [editedPost, setEditedPost] = useState("")
  const [selectedTone, setSelectedTone] = useState("professional")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Simulate loading repository data
    setTimeout(() => {
      const repo = mockRepositories[repoId]
      if (repo) {
        setRepository(repo)
        const posts =
          platform === "linkedin" ? mockGeneratedPosts.linkedin[repoId] || [] : mockGeneratedPosts.twitter[repoId] || []

        setGeneratedPosts(posts)
        if (posts.length > 0) {
          setSelectedPost(posts[0])
          setEditedPost(posts[0].content)
        }
      }
      setIsLoading(false)
    }, 1500)
  }, [repoId, platform])

  const handleGenerateMore = () => {
    setIsGenerating(true)
    // Simulate generating more posts with the selected tone
    setTimeout(() => {
      const newPost = {
        id: `post${generatedPosts.length + 1}`,
        content: `New ${selectedTone} ${platform === "linkedin" ? "LinkedIn post" : "tweet"} for ${repository.name} with a ${selectedTone} tone. This is a simulation of AI-generated content that would analyze the repository's README and package.json to create a compelling ${platform === "linkedin" ? "LinkedIn post" : "tweet"}.`,
      }
      setGeneratedPosts([...generatedPosts, newPost])
      setSelectedPost(newPost)
      setEditedPost(newPost.content)
      setIsGenerating(false)

      toast({
        title: "New post generated!",
        description: `A new ${selectedTone} post has been created for your project.`,
      })
    }, 2000)
  }

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(editedPost)
    setCopied(true)

    toast({
      title: "Copied to clipboard",
      description: `Your ${platform === "linkedin" ? "LinkedIn post" : "X post"} has been copied to the clipboard.`,
    })

    setTimeout(() => setCopied(false), 2000)
  }

  const handlePostSelect = (post) => {
    setSelectedPost(post)
    setEditedPost(post.content)
  }

  const handlePlatformChange = (newPlatform) => {
    router.push(`/generate/${repoId}?platform=${newPlatform}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-blue-500 mb-4" />
          <p className="text-white text-lg">Analyzing repository...</p>
          <p className="text-zinc-400 text-sm mt-2">This may take a moment</p>
        </div>
      </div>
    )
  }

  if (!repository) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-black flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-xl mb-4">Repository not found.</p>
          <Button
            variant="outline"
            className="mt-4 border-white/20 text-white hover:bg-white/10"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            className="mb-6 border-zinc-700 text-zinc-400 hover:bg-zinc-800"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Repositories
          </Button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <BookOpenIcon className="h-5 w-5 text-blue-400" />
                <h1 className="text-3xl font-bold">{repository.name}</h1>
              </div>
              <p className="text-zinc-400 mt-1">{repository.description}</p>
            </div>

            <Tabs value={platform} onValueChange={handlePlatformChange} className="w-full md:w-auto">
              <TabsList className="bg-zinc-900 border border-zinc-800 p-1 w-full md:w-auto">
                <TabsTrigger
                  value="linkedin"
                  className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md"
                >
                  <LinkedinIcon className="h-4 w-4" />
                  LinkedIn
                </TabsTrigger>
                <TabsTrigger
                  value="twitter"
                  className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md"
                >
                  <TwitterIcon className="h-4 w-4" />X / Twitter
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 flex flex-wrap gap-4 items-center">
            <div className="flex items-center">
              <div
                className={`h-3 w-3 rounded-full mr-2 bg-${repository.language === "TypeScript" ? "blue" : repository.language === "JavaScript" ? "yellow" : repository.language === "Python" ? "green" : "purple"}-500`}
              ></div>
              <span>{repository.language}</span>
            </div>
            <Separator orientation="vertical" className="h-6 bg-zinc-700" />
            <div className="flex items-center">
              <PackageIcon className="h-4 w-4 mr-2 text-zinc-400" />
              <span>{Object.keys(repository.packageJson.dependencies).length} Dependencies</span>
            </div>
            <Separator orientation="vertical" className="h-6 bg-zinc-700" />
            <div className="flex items-center">
              <GitBranchIcon className="h-4 w-4 mr-2 text-zinc-400" />
              <span>main</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Repository Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-zinc-900/70 border-zinc-800">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <CodeIcon className="h-5 w-5 mr-2 text-blue-400" />
                  Repository Analysis
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-zinc-400">Primary Language</h3>
                    <p className="mt-1 font-medium">{repository.language}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-zinc-400">Key Technologies</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {repository.packageJson &&
                        Object.keys(repository.packageJson.dependencies)
                          .slice(0, 5)
                          .map((dep) => (
                            <Badge key={dep} variant="outline" className="bg-zinc-800 text-zinc-300 border-zinc-700">
                              {dep}
                            </Badge>
                          ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-zinc-400">README Preview</h3>
                    <div className="mt-2 text-sm text-zinc-400 max-h-40 overflow-y-auto p-3 bg-zinc-800/50 rounded-md border border-zinc-700">
                      <pre className="whitespace-pre-wrap font-mono text-xs">
                        {repository.readme.substring(0, 200)}...
                      </pre>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/70 border-zinc-800">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <RefreshCw className="h-5 w-5 mr-2 text-blue-400" />
                  Generate Options
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-zinc-400 mb-2 block">Post Tone</label>
                    <Select value={selectedTone} onValueChange={setSelectedTone}>
                      <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-white">
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                        {toneOptions.map((tone) => (
                          <SelectItem key={tone.value} value={tone.value}>
                            {tone.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={handleGenerateMore}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Generate New Post
                        </>
                      )}
                    </Button>
                  </div>
                  <Separator className="bg-zinc-800" />
                  <div>
                    <h3 className="text-sm font-medium text-zinc-400 mb-3">Post Variations</h3>
                    <div className="space-y-2">
                      {generatedPosts.map((post) => (
                        <Button
                          key={post.id}
                          variant={selectedPost?.id === post.id ? "default" : "outline"}
                          className={`w-full justify-start ${
                            selectedPost?.id === post.id
                              ? "bg-blue-600 hover:bg-blue-700"
                              : "bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                          }`}
                          onClick={() => handlePostSelect(post)}
                        >
                          {selectedPost?.id === post.id && <CheckIcon className="h-4 w-4 mr-2" />}
                          Variation {post.id.replace("post", "").replace("tweet", "")}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Post Editor */}
          <div className="lg:col-span-2">
            <Card className="bg-zinc-900/70 border-zinc-800">
              <CardContent className="p-6">
                <Tabs defaultValue="edit">
                  <TabsList className="bg-zinc-800 border border-zinc-700 mb-4">
                    <TabsTrigger value="edit" className="data-[state=active]:bg-zinc-700">
                      Edit
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="data-[state=active]:bg-zinc-700">
                      Preview
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="edit" className="mt-0">
                    <Textarea
                      className="min-h-[400px] bg-zinc-800 border-zinc-700 text-white font-medium"
                      value={editedPost}
                      onChange={(e) => setEditedPost(e.target.value)}
                      placeholder={`Your ${platform === "linkedin" ? "LinkedIn post" : "X post"} content will appear here...`}
                    />
                    <div className="flex justify-between mt-2 text-xs text-zinc-500">
                      <span>
                        {platform === "linkedin" ? "LinkedIn" : "X"} {platform === "linkedin" ? "post" : "tweet"}
                      </span>
                      <span>{editedPost.length} characters</span>
                    </div>
                  </TabsContent>
                  <TabsContent value="preview" className="mt-0">
                    <div className="min-h-[400px] p-6 bg-zinc-800 border border-zinc-700 rounded-md">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="font-bold">JD</span>
                        </div>
                        <div>
                          <div className="font-semibold">Jane Developer</div>
                          <div className="text-xs text-zinc-400">Full Stack Developer</div>
                        </div>
                      </div>
                      <div className="whitespace-pre-line">{editedPost}</div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={handleCopyToClipboard}>
                          {copied ? (
                            <>
                              <CheckIcon className="mr-2 h-4 w-4" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="mr-2 h-4 w-4" />
                              Copy to Clipboard
                            </>
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy post content to clipboard</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" className="flex-1 border-blue-600 text-blue-500 hover:bg-blue-600/10">
                          {platform === "linkedin" ? (
                            <>
                              <LinkedinIcon className="mr-2 h-4 w-4" />
                              Share on LinkedIn
                            </>
                          ) : (
                            <>
                              <TwitterIcon className="mr-2 h-4 w-4" />
                              Share on X
                            </>
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Open {platform === "linkedin" ? "LinkedIn" : "X"} to share this post</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" className="flex-none border-zinc-700 text-zinc-400 hover:bg-zinc-800">
                          <Share2Icon className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>More sharing options</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
