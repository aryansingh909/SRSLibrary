import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://studynest.in';
  const now = new Date();

  return [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/library`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/degrees`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/courses/bca`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/courses/bba`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/courses/ba`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/courses/mba`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/courses/ma`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/courses/mcom`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/gallery`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
  ];
}
