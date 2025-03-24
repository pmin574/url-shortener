import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function GET(
  _request: Request,
  { params }: { params: { shortId: string } }
) {
  const shortId = await Promise.resolve(params.shortId);
  const url = storage.getUrl(shortId);

  if (!url) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // Increment the click count
  storage.incrementClicks(shortId);

  return NextResponse.redirect(url.longUrl);
}
