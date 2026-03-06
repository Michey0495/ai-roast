import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/api/mcp"],
        disallow: ["/api/roast", "/api/feedback", "/api/like", "/api/feed"],
      },
    ],
    sitemap: "https://ai-roast.ezoai.jp/sitemap.xml",
  };
}
