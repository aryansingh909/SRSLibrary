'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Clock, ArrowRight, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string | null;
  cover_image: string | null;
  created_at: string;
}

const PLACEHOLDER_IMAGES: Record<string, string> = {
  'Study Tips': 'https://images.pexels.com/photos/3184328/pexels-photo-3184328.jpeg?w=600&h=400&fit=crop',
  'Online Education': 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?w=600&h=400&fit=crop',
  'Career Guidance': 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?w=600&h=400&fit=crop',
  'Study Environment': 'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?w=600&h=400&fit=crop',
  'Course Comparison': 'https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?w=600&h=400&fit=crop',
};

function getImage(post: BlogPost) {
  if (post.cover_image) return post.cover_image;
  if (post.category && PLACEHOLDER_IMAGES[post.category]) return PLACEHOLDER_IMAGES[post.category];
  return 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?w=600&h=400&fit=crop';
}

function timeAgo(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('blog_posts')
        .select('id,title,slug,excerpt,category,cover_image,created_at')
        .eq('published', true)
        .order('created_at', { ascending: false });
      if (data) setPosts(data);
      setLoading(false);
    })();
  }, []);

  const categories = ['All', ...Array.from(new Set(posts.map((p) => p.category).filter(Boolean) as string[]))];
  const filtered = activeCategory === 'All' ? posts : posts.filter((p) => p.category === activeCategory);

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <Badge className="mb-4 bg-white/15 text-white border-white/30">
            <BookOpen className="w-3 h-3 mr-1.5" />
            Blog & Resources
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Learn, Grow, Succeed</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Expert articles on study techniques, online education, career guidance, and everything you need to achieve your academic and professional goals.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-6 bg-background border-b border-border sticky top-16 z-10 backdrop-blur-sm bg-background/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-slate-100 dark:bg-slate-800 text-foreground/70 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Tag className="w-3 h-3 inline mr-1" />
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl border border-border overflow-hidden animate-pulse">
                  <div className="h-48 bg-slate-200 dark:bg-slate-800" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
                    <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No posts in this category yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((post) => (
                <article key={post.id} className="group bg-white dark:bg-slate-900 rounded-2xl border border-border shadow-sm overflow-hidden card-hover">
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={getImage(post)}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {post.category && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-600 text-white">
                        {post.category}
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <Clock className="w-3 h-3" />
                      {timeAgo(post.created_at)}
                      <span>·</span>
                      <span>5 min read</span>
                    </div>
                    <h2 className="font-bold text-foreground mb-2 leading-snug group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1.5 text-blue-600 text-sm font-medium hover:gap-2.5 transition-all"
                    >
                      Read More <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950/50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-3">Ready to Take the Next Step?</h2>
          <p className="text-muted-foreground mb-6">Join our premium study library or apply for an online degree today. Our counsellors are here to guide you.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/library">
              <button className="btn-primary">Join the Library</button>
            </Link>
            <Link href="/degrees">
              <button className="btn-outline">Apply for a Degree</button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
