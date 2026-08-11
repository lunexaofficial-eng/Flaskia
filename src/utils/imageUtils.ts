export function getProxiedImageUrl(url?: string): string {
  if (!url) {
    return "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=400";
  }
  if (url.startsWith("/api/image-proxy")) {
    return url;
  }
  if (url.includes("rexvora.com") || url.startsWith("https://storage.rexvora.com")) {
    return `/api/image-proxy?url=${encodeURIComponent(url)}`;
  }
  return url;
}
