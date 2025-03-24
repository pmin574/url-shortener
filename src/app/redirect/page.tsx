"use client";

import { useEffect, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { storage } from "@/lib/storage";

function RedirectContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const url = storage.getUrl(id);
      if (url) {
        // Increment click count
        storage.incrementClicks(id);
        // Redirect to the original URL
        window.location.href = url;
      } else {
        setError("URL not found. It may have been deleted or expired.");
      }
    } else {
      setError("No URL ID provided.");
    }
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <a
            href="/url-shortener"
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            ← Back to URL Shortener
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Redirecting...
        </h1>
        <p className="text-gray-600">
          Please wait while we redirect you to the destination.
        </p>
      </div>
    </div>
  );
}

export default function RedirectPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Loading...
            </h1>
            <p className="text-gray-600">
              Please wait while we prepare your redirect.
            </p>
          </div>
        </div>
      }
    >
      <RedirectContent />
    </Suspense>
  );
}
