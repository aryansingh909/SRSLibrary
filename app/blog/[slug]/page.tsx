'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, ArrowLeft, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  category: string | null;
  cover_image: string | null;
  created_at: string;
  meta_title: string | null;
  meta_desc: string | null;
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', params.slug)
        .eq('published', true)
        .maybeSingle();
      if (!data) { setNotFoundState(true); } else { setPost(data); }
      setLoading(false);
    })();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (notFoundState || !post) {
    return (
      <div className="pt-16 min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <BookOpen className="w-12 h-12 text-muted-foreground" />
        <h2 className="text-2xl font-bold text-foreground">Post Not Found</h2>
        <p className="text-muted-foreground">The post you are looking for does not exist.</p>
        <Link href="/blog" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>
      </div>
    );
  }

  const image = post.cover_image || 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?w=1200&h=500&fit=crop';

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative py-20 bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.25 }} />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 to-slate-950" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <Link href="/blog" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
          {post.category && (
            <Badge className="mb-4 bg-blue-600/80 text-white border-blue-500/50">{post.category}</Badge>
          )}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">{post.title}</h1>
          {post.excerpt && <p className="text-slate-300 text-lg leading-relaxed">{post.excerpt}</p>}
          <div className="flex items-center gap-3 text-sm text-slate-400 mt-4">
            <Clock className="w-4 h-4" />
            <span>{new Date(post.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span>·</span>
            <span>5 min read</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-14 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {post.content ? (
            <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-p:text-muted-foreground prose-p:leading-relaxed">
              {post.content.split('\n').map((para, i) => (
                para.trim() ? <p key={i} className="mb-4 text-muted-foreground leading-relaxed">{para}</p> : <br key={i} />
              ))}
            </div>
          ) : (
            <div className="space-y-6 text-muted-foreground">
              <p className="text-lg leading-relaxed">{post.excerpt}</p>
              <p className="leading-relaxed">
                At SRS Library, we are committed to providing not just a premium study environment but also expert guidance to help you make the most of your academic journey. Whether you are preparing for competitive exams, pursuing an online degree, or looking for a quiet place to focus — we are here for you.
              </p>
              <p className="leading-relaxed">
                Our library is equipped with 40 individual AC study seats, high-speed WiFi, CCTV surveillance, 24x7 power backup, clean washrooms, and dedicated parking — everything you need to study without distractions.
              </p>
              <p className="leading-relaxed">
                For those looking to advance their education, we offer expert counselling for online degree admissions from Mangalayatan University — a UGC-approved institution offering programs like BCA, BBA, BA, MBA, MA, and M.Com.
              </p>
              <div className="mt-8 p-6 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                <p className="font-semibold text-foreground mb-2">Want to learn more?</p>
                <p className="text-sm mb-3">Talk to our education counsellor for personalized guidance — completely free.</p>
                <a href="/contact" className="inline-flex items-center text-blue-600 font-medium text-sm hover:text-blue-700">
                  Get Free Counselling →
                </a>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
