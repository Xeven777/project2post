import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { repoId: string } }
) {
  try {
    // Get the authenticated session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Access token should be available in the session
    const accessToken = session.accessToken as string;
    if (!accessToken) {
      return NextResponse.json(
        { error: "GitHub authorization required" },
        { status: 401 }
      );
    }

    // Fetch the repository details from GitHub API
    const repoResponse = await fetch(
      `https://api.github.com/repositories/${params.repoId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!repoResponse.ok) {
      return NextResponse.json(
        { error: `GitHub API error: ${repoResponse.statusText}` },
        { status: repoResponse.status }
      );
    }

    const repoData = await repoResponse.json();

    // Fetch the README content
    let readme = null;
    try {
      const readmeResponse = await fetch(
        `https://api.github.com/repos/${repoData.full_name}/readme`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (readmeResponse.ok) {
        const readmeData = await readmeResponse.json();
        // The content is base64 encoded
        readme = Buffer.from(readmeData.content, "base64").toString("utf-8");
      }
    } catch (readmeError) {
      console.error("Error fetching README:", readmeError);
    }

    // Try to fetch package.json to extract dependencies
    let packageJson = null;
    try {
      const packageResponse = await fetch(
        `https://api.github.com/repos/${repoData.full_name}/contents/package.json`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (packageResponse.ok) {
        const packageData = await packageResponse.json();
        const packageContent = Buffer.from(
          packageData.content,
          "base64"
        ).toString("utf-8");
        packageJson = JSON.parse(packageContent);
      }
    } catch (packageError) {
      console.error("Error fetching package.json:", packageError);
    }

    // Combine all the data
    const enrichedRepo = {
      ...repoData,
      readme,
      packageJson,
    };

    return NextResponse.json(enrichedRepo);
  } catch (error) {
    console.error("Error fetching repository:", error);
    return NextResponse.json(
      { error: "Failed to fetch repository" },
      { status: 500 }
    );
  }
}
