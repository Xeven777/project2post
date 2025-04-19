"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Post tone options
const toneOptions = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "technical", label: "Technical" },
  { value: "enthusiastic", label: "Enthusiastic" },
  { value: "informative", label: "Informative" },
];

// Repository type definition
interface Repository {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  language: string | null;
  private: boolean;
  default_branch: string;
  readme?: string;
  packageJson?: {
    dependencies: Record<string, string>;
    devDependencies?: Record<string, string>;
  };
}

// Post type definition
interface Post {
  id: string;
  content: string;
}

export default function GeneratePostPage() {
  const { repoId } = useParams();
  const searchParams = useSearchParams();
  const platform = searchParams.get("platform") || "linkedin";
  const router = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [repository, setRepository] = useState<Repository | null>(null);
  const [generatedPosts, setGeneratedPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [editedPost, setEditedPost] = useState("");
  const [selectedTone, setSelectedTone] = useState("professional");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepositoryData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch repository details
        const repoResponse = await fetch(`/api/github/repo/${repoId}`);

        if (!repoResponse.ok) {
          throw new Error(
            `Failed to fetch repository: ${repoResponse.statusText}`
          );
        }

        const repoData = await repoResponse.json();
        setRepository(repoData);

        // After getting repo data, generate an initial post
        generateInitialPost(repoData);
      } catch (err) {
        console.error("Error fetching repository data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load repository data"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchRepositoryData();
  }, [repoId]);

  const generateInitialPost = async (repo: Repository) => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repository: repo,
          platform,
          tone: selectedTone,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate post: ${response.statusText}`);
      }

      const data = await response.json();

      const newPost = {
        id: "post1",
        content: data.content,
      };

      setGeneratedPosts([newPost]);
      setSelectedPost(newPost);
      setEditedPost(newPost.content);
    } catch (err) {
      console.error("Error generating post:", err);
      toast({
        title: "Error generating post",
        description:
          err instanceof Error ? err.message : "Failed to generate post",
        variant: "destructive",
      });

      // Create a fallback post if generation fails
      const fallbackPost = {
        id: "post1",
        content: `Check out my ${repo.name} project on GitHub!\n\n${
          repo.description || ""
        }\n\nBuilt with ${repo.language || "code"}.\n\n#GitHub #Development`,
      };

      setGeneratedPosts([fallbackPost]);
      setSelectedPost(fallbackPost);
      setEditedPost(fallbackPost.content);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateMore = async () => {
    if (!repository) return;

    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repository,
          platform,
          tone: selectedTone,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate post: ${response.statusText}`);
      }

      const data = await response.json();

      const newPost = {
        id: `post${generatedPosts.length + 1}`,
        content: data.content,
      };

      setGeneratedPosts([...generatedPosts, newPost]);
      setSelectedPost(newPost);
      setEditedPost(newPost.content);

      toast({
        title: "New post generated!",
        description: `A new ${selectedTone} post has been created for your project.`,
      });
    } catch (err) {
      console.error("Error generating more posts:", err);
      toast({
        title: "Error generating post",
        description:
          err instanceof Error ? err.message : "Failed to generate post",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(editedPost);
    setCopied(true);

    toast({
      title: "Copied to clipboard",
      description: `Your ${
        platform === "linkedin" ? "LinkedIn post" : "X post"
      } has been copied to the clipboard.`,
    });

    setTimeout(() => setCopied(false), 2000);
  };

  const handlePostSelect = (post: Post) => {
    setSelectedPost(post);
    setEditedPost(post.content);
  };

  const handlePlatformChange = (newPlatform: string) => {
    router.push(`/generate/${repoId}?platform=${newPlatform}`);
  };

  const getLanguageColor = (language: string | null) => {
    if (!language) return "bg-gray-500";

    const colors: Record<string, string> = {
      JavaScript: "bg-yellow-400",
      TypeScript: "bg-blue-400",
      HTML: "bg-orange-500",
      CSS: "bg-purple-500",
      Python: "bg-green-500",
      Java: "bg-red-500",
      Ruby: "bg-red-600",
      Go: "bg-blue-300",
      PHP: "bg-indigo-400",
      default: "bg-gray-400",
    };

    return colors[language] || colors.default;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-zinc-950 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-blue-500 mb-4" />
          <p className="text-white text-lg">Analyzing repository...</p>
          <p className="text-zinc-400 text-sm mt-2">This may take a moment</p>
        </div>
      </div>
    );
  }

  if (error || !repository) {
    return (
      <div className="min-h-screen bg-linear-to-b from-zinc-950 to-black flex items-center justify-center">
        <div className="text-center text-white max-w-md">
          <p className="text-xl mb-4">
            {error || "Repository not found or could not be loaded."}
          </p>
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
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-950 to-black text-white">
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

            <Tabs
              value={platform}
              onValueChange={handlePlatformChange}
              className="w-full md:w-auto"
            >
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
                className={`h-3 w-3 rounded-full mr-2 ${getLanguageColor(
                  repository.language
                )}`}
              ></div>
              <span>{repository.language || "Unknown"}</span>
            </div>
            <Separator orientation="vertical" className="h-6 bg-zinc-700" />
            <div className="flex items-center">
              <PackageIcon className="h-4 w-4 mr-2 text-zinc-400" />
              <span>
                {repository.packageJson
                  ? Object.keys(repository.packageJson.dependencies).length
                  : 0}{" "}
                Dependencies
              </span>
            </div>
            <Separator orientation="vertical" className="h-6 bg-zinc-700" />
            <div className="flex items-center">
              <GitBranchIcon className="h-4 w-4 mr-2 text-zinc-400" />
              <span>{repository.default_branch || "main"}</span>
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
                    <h3 className="text-sm font-medium text-zinc-400">
                      Primary Language
                    </h3>
                    <p className="mt-1 font-medium">
                      {repository.language || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-zinc-400">
                      Key Technologies
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {repository.packageJson &&
                        Object.keys(repository.packageJson.dependencies || {})
                          .slice(0, 5)
                          .map((dep) => (
                            <Badge
                              key={dep}
                              variant="outline"
                              className="bg-zinc-800 text-zinc-300 border-zinc-700"
                            >
                              {dep}
                            </Badge>
                          ))}
                      {(!repository.packageJson ||
                        !repository.packageJson.dependencies ||
                        Object.keys(repository.packageJson.dependencies)
                          .length === 0) && (
                        <span className="text-zinc-500">
                          No dependencies found
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-zinc-400">
                      README Preview
                    </h3>
                    <div className="mt-2 text-sm text-zinc-400 max-h-40 overflow-y-auto p-3 bg-zinc-800/50 rounded-md border border-zinc-700">
                      {repository.readme ? (
                        <pre className="whitespace-pre-wrap font-mono text-xs">
                          {repository.readme.substring(0, 200)}...
                        </pre>
                      ) : (
                        <span className="text-zinc-500">
                          README not available
                        </span>
                      )}
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
                    <label className="text-sm font-medium text-zinc-400 mb-2 block">
                      Post Tone
                    </label>
                    <Select
                      value={selectedTone}
                      onValueChange={setSelectedTone}
                    >
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
                    <h3 className="text-sm font-medium text-zinc-400 mb-3">
                      Post Variations
                    </h3>
                    <div className="space-y-2">
                      {generatedPosts.map((post) => (
                        <Button
                          key={post.id}
                          variant={
                            selectedPost?.id === post.id ? "default" : "outline"
                          }
                          className={`w-full justify-start ${
                            selectedPost?.id === post.id
                              ? "bg-blue-600 hover:bg-blue-700"
                              : "bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                          }`}
                          onClick={() => handlePostSelect(post)}
                        >
                          {selectedPost?.id === post.id && (
                            <CheckIcon className="h-4 w-4 mr-2" />
                          )}
                          Variation{" "}
                          {post.id.replace("post", "").replace("tweet", "")}
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
                    <TabsTrigger
                      value="edit"
                      className="data-[state=active]:bg-zinc-700"
                    >
                      Edit
                    </TabsTrigger>
                    <TabsTrigger
                      value="preview"
                      className="data-[state=active]:bg-zinc-700"
                    >
                      Preview
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="edit" className="mt-0">
                    <Textarea
                      className="min-h-[400px] bg-zinc-800 border-zinc-700 text-white font-medium"
                      value={editedPost}
                      onChange={(e) => setEditedPost(e.target.value)}
                      placeholder={`Your ${
                        platform === "linkedin" ? "LinkedIn post" : "X post"
                      } content will appear here...`}
                    />
                    <div className="flex justify-between mt-2 text-xs text-zinc-500">
                      <span>
                        {platform === "linkedin" ? "LinkedIn" : "X"}{" "}
                        {platform === "linkedin" ? "post" : "tweet"}
                      </span>
                      <span>{editedPost.length} characters</span>
                    </div>
                  </TabsContent>
                  <TabsContent value="preview" className="mt-0">
                    <div className="min-h-[400px] p-6 bg-zinc-800 border border-zinc-700 rounded-md">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="h-12 w-12 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="font-bold">JD</span>
                        </div>
                        <div>
                          <div className="font-semibold">Jane Developer</div>
                          <div className="text-xs text-zinc-400">
                            Full Stack Developer
                          </div>
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
                        <Button
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                          onClick={handleCopyToClipboard}
                        >
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
                        <Button
                          variant="outline"
                          className="flex-1 border-blue-600 text-blue-500 hover:bg-blue-600/10"
                        >
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
                        <p>
                          Open {platform === "linkedin" ? "LinkedIn" : "X"} to
                          share this post
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          className="flex-none border-zinc-700 text-zinc-400 hover:bg-zinc-800"
                        >
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
  );
}
