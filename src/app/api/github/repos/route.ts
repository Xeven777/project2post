import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth"; // Import auth from your auth.ts file
import { Octokit } from "@octokit/rest";

export async function GET(req: NextRequest) {
  try {
    // Use the auth() function to get the session
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Access the token from the account property on the session
    const accessToken =
      session.accessToken ||
      (session as any)?.account?.access_token ||
      (session as any)?.account?.accessToken;

    if (!accessToken) {
      console.error(
        "No access token found in session:",
        JSON.stringify(session, null, 2)
      );
      return NextResponse.json(
        { error: "GitHub access token not found" },
        { status: 401 }
      );
    }

    const octokit = new Octokit({ auth: accessToken });

    // Fetch repositories for the authenticated user
    const { data: repos } = await octokit.repos.listForAuthenticatedUser({
      type: "all", // Includes both owned and member repositories
      sort: "updated",
      per_page: 100,
    });

    return NextResponse.json(repos);
  } catch (error) {
    console.error("Error fetching GitHub repositories:", error);

    // More detailed error response
    if (error instanceof Error) {
      // Handle rate limiting specifically
      if (
        (error as any).status === 403 &&
        (error as any).message?.includes("rate limit")
      ) {
        return NextResponse.json(
          { error: "GitHub API rate limit exceeded. Please try again later." },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { error: "Failed to fetch repositories", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch repositories" },
      { status: 500 }
    );
  }
}
