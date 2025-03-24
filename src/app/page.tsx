"use client";

import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { storage } from "@/lib/storage";
import {
  LinkIcon,
  ArrowPathIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

type UrlMapping = {
  shortId: string;
  longUrl: string;
  clicks: number;
  createdAt: string;
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [previousUrls, setPreviousUrls] = useState<UrlMapping[]>([]);

  useEffect(() => {
    setPreviousUrls(storage.getAllUrls());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        throw new Error(
          "Please enter a valid URL starting with http:// or https://"
        );
      }

      const shortId = nanoid(8);
      storage.saveUrl(url, shortId);
      setPreviousUrls(storage.getAllUrls());
      setShortUrl(
        `${window.location.origin}/url-shortener/redirect?id=${shortId}`
      );
      setUrl("");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to shorten URL");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (urlToCopy: string) => {
    try {
      await navigator.clipboard.writeText(urlToCopy);
      alert("Copied to clipboard!");
    } catch {
      alert("Failed to copy to clipboard");
    }
  };

  const handleClearHistory = () => {
    storage.clearAll();
    setPreviousUrls([]);
    setShortUrl(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 md:p-24">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            URL Shortener
          </h1>
          <p className="text-lg text-gray-600">
            Simplify your links with our modern URL shortener
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label
                  htmlFor="url"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Enter your URL
                </label>
                <div className="relative">
                  <input
                    type="url"
                    id="url"
                    required
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 pl-10 text-gray-900"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto px-6 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <ArrowPathIcon className="h-5 w-5 animate-spin" />
                  ) : (
                    "Shorten URL"
                  )}
                </button>
              </div>
            </div>
          </form>

          {shortUrl && (
            <div className="mt-8 p-4 bg-purple-50 rounded-lg">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex-1 w-full">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Shortened URL:
                  </p>
                  <p className="text-purple-600 font-medium truncate">
                    {shortUrl}
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(shortUrl)}
                  className="px-4 py-2 text-sm bg-white text-purple-600 font-medium rounded-lg border border-purple-200 hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
                >
                  Copy to Clipboard
                </button>
              </div>
            </div>
          )}

          {previousUrls.length > 0 && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Previous URLs
                </h2>
                <button
                  onClick={handleClearHistory}
                  className="px-4 py-2 text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Clear History
                </button>
              </div>
              <div className="space-y-4">
                {previousUrls.map((item) => (
                  <div
                    key={item.shortId}
                    className="p-4 bg-gray-50 rounded-lg space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500 truncate">
                        {item.longUrl}
                      </p>
                      <span className="text-xs text-gray-400 flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-purple-600 font-medium">
                        {`${window.location.origin}/url-shortener/redirect?id=${item.shortId}`}
                      </p>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">
                          {item.clicks} clicks
                        </span>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              `${window.location.origin}/url-shortener/redirect?id=${item.shortId}`
                            )
                          }
                          className="px-3 py-1 text-sm bg-white text-purple-600 font-medium rounded-md border border-purple-200 hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
