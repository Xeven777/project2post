"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { GithubIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function GitHubAuthPage() {
  useEffect(() => {
    // In a real application, we would implement the GitHub OAuth flow
    // For now, we'll simulate the auth process
  }, [])

  const handleAuth = () => {
    // In a real application, this would redirect to GitHub OAuth
    // For demo purposes, we'll redirect to the dashboard
    window.location.href = "/dashboard"
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 text-white">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">GitHub Authentication</CardTitle>
          <CardDescription className="text-zinc-400">
            Connect your GitHub account to access your repositories
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
            <h3 className="font-medium mb-2">Why we need access:</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Read your repositories (including private ones)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Access README files and package information</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>We never store your code or sensitive data</span>
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleAuth}>
            <GithubIcon className="mr-2 h-5 w-5" />
            Authorize with GitHub
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
