import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { storage } from "@/lib/storage";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Create a short URL
    const shortId = nanoid(8);
    const shortUrl = storage.saveUrl(url, shortId);

    return NextResponse.json({ shortId: shortUrl.shortId });
  } catch (error) {
    console.error("Error creating short URL:", error);
    return NextResponse.json(
      { error: "Error creating short URL" },
      { status: 500 }
    );
  }
}
