import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { repository, platform, tone } = body;

    // Validate required parameters
    if (!repository) {
      return NextResponse.json(
        { error: "Repository data is required" },
        { status: 400 }
      );
    }

    if (!platform || (platform !== "linkedin" && platform !== "twitter")) {
      return NextResponse.json(
        { error: "Valid platform (linkedin or twitter) is required" },
        { status: 400 }
      );
    }

    // Extract key information from repository
    const {
      name,
      description,
      language,
      readme,
      packageJson,
      stargazers_count,
      html_url,
    } = repository;

    // Create a prompt for the AI
    let prompt = `Generate a ${
      platform === "linkedin" ? "LinkedIn post" : "tweet for X/Twitter"
    } 
    in a ${tone || "professional"} tone about the following GitHub repository:

    Repository Name: ${name}
    Description: ${description || "No description provided"}
    Language: ${language || "Not specified"}
    Stars: ${stargazers_count}
    URL: ${html_url}
    `;

    // Add information about dependencies if available
    if (packageJson && packageJson.dependencies) {
      prompt += `\nKey Dependencies: ${Object.keys(packageJson.dependencies)
        .slice(0, 5)
        .join(", ")}`;
    }

    // Add snippet from readme if available
    if (readme) {
      prompt += `\n\nREADME Excerpt (first 500 characters): 
      ${readme.substring(0, 500)}...`;
    }

    // Specific instructions based on platform
    if (platform === "linkedin") {
      prompt += `\n\nWrite a professional LinkedIn post that showcases this project. 
      The post should be between 200-350 characters, include relevant hashtags, 
      and encourage engagement. Focus on the technical achievements, skills 
      demonstrated, or problems solved by this project.`;
    } else {
      // Twitter/X has a 280 character limit
      prompt += `\n\nWrite a concise tweet that fits within 280 characters. 
      Include relevant hashtags and make it engaging. Focus on the most impressive 
      or interesting aspect of this repository to capture attention.`;
    }

    prompt += `\n\nMake sure the post reflects a ${
      tone || "professional"
    } tone and is ready to share as-is.`;

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.warn(
        "OpenAI API key not configured. Returning fallback content."
      );
      return NextResponse.json({
        content: `Check out my ${name} project on GitHub!\n\n${
          description || ""
        }\n\nBuilt with ${language || "code"}.\n\n#GitHub #Development`,
      });
    }

    try {
      // Call the AI to generate the content
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a professional social media content creator specializing in tech and developer content. Your task is to create engaging posts about GitHub repositories.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      // Extract the generated content
      const generatedContent =
        completion.choices[0].message.content ||
        `Check out my ${name} project on GitHub!\n\n${
          description || ""
        }\n\nBuilt with ${language || "code"}.\n\n#GitHub #Development`;

      return NextResponse.json({
        content: generatedContent,
      });
    } catch (openaiError: any) {
      console.error("OpenAI API error:", openaiError);

      // Return a fallback response when the API call fails
      return NextResponse.json({
        content: `Check out my ${name} project on GitHub!\n\n${
          description || ""
        }\n\nBuilt with ${language || "code"}.\n\n#GitHub #Development`,
      });
    }
  } catch (error) {
    console.error("Error in post generation:", error);
    return NextResponse.json(
      { error: "Failed to generate post" },
      { status: 500 }
    );
  }
}
