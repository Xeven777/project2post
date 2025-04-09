import { Button } from "@/components/ui/button";
import { GithubIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signIn } from "@/auth";

export default function GitHubAuthPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 text-white">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            GitHub Authentication
          </CardTitle>
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
          <form
            action={async () => {
              "use server";
              await signIn("github");
            }}
            className="w-full"
          >
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              type="submit"
            >
              <GithubIcon className="mr-2 h-5 w-5" />
              Authorize with GitHub
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
