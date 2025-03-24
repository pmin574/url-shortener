interface UrlMapping {
  longUrl: string;
  shortId: string;
  createdAt: string;
  clicks: number;
}

const STORAGE_KEY = "url_mappings";

export const storage = {
  getAllUrls: (): UrlMapping[] => {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  getUrl: (shortId: string): string | undefined => {
    if (typeof window === "undefined") return undefined;
    const urls = storage.getAllUrls();
    const url = urls.find((url) => url.shortId === shortId);
    return url?.longUrl;
  },

  saveUrl: (longUrl: string, shortId: string): UrlMapping => {
    const newUrl: UrlMapping = {
      longUrl,
      shortId,
      createdAt: new Date().toISOString(),
      clicks: 0,
    };

    const urls = storage.getAllUrls();
    urls.push(newUrl);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(urls));
    return newUrl;
  },

  incrementClicks: (shortId: string): void => {
    const urls = storage.getAllUrls();
    const updatedUrls = urls.map((url) =>
      url.shortId === shortId ? { ...url, clicks: (url.clicks || 0) + 1 } : url
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUrls));
  },

  clearAll: () => {
    localStorage.removeItem(STORAGE_KEY);
  },
};
