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

  getUrl: (shortId: string): UrlMapping | undefined => {
    if (typeof window === "undefined") return undefined;
    const urls = storage.getAllUrls();
    return urls.find((url) => url.shortId === shortId);
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
    const urlIndex = urls.findIndex((url) => url.shortId === shortId);
    if (urlIndex !== -1) {
      urls[urlIndex].clicks += 1;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(urls));
    }
  },
};
