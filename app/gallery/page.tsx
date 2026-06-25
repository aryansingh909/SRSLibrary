'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Camera, X } from 'lucide-react';
import type { Metadata } from 'next';

const CATEGORIES = ['All', 'Study Hall', 'AC Facilities', 'Parking', 'Reading Zone', 'Infrastructure'];

const IMAGES = [
  { src: 'https://images.pexels.com/photos/3184328/pexels-photo-3184328.jpeg?w=800&h=600&fit=crop', category: 'Study Hall', caption: 'Premium Study Hall' },
  { src: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?w=800&h=600&fit=crop', category: 'AC Facilities', caption: 'Fully Air Conditioned' },
  { src: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?w=800&h=600&fit=crop', category: 'Reading Zone', caption: 'Extensive Book Collection' },
  { src: 'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?w=800&h=600&fit=crop', category: 'Reading Zone', caption: 'Quiet Reading Corner' },
  { src: 'https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?w=800&h=600&fit=crop', category: 'Study Hall', caption: 'Individual Study Desks' },
  { src: 'https://images.pexels.com/photos/2041627/pexels-photo-2041627.jpeg?w=800&h=600&fit=crop', category: 'Infrastructure', caption: 'Modern Infrastructure' },
  { src: 'https://images.pexels.com/photos/1350197/pexels-photo-1350197.jpeg?w=800&h=600&fit=crop', category: 'Parking', caption: 'Dedicated Parking Area' },
  { src: 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?w=800&h=600&fit=crop', category: 'Study Hall', caption: 'Study Hall — Full View' },
  { src: 'https://images.pexels.com/photos/374820/pexels-photo-374820.jpeg?w=800&h=600&fit=crop', category: 'AC Facilities', caption: 'AC Vent & Climate Control' },
  { src: 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?w=800&h=600&fit=crop', category: 'Infrastructure', caption: 'Clean Washrooms' },
  { src: 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?w=800&h=600&fit=crop', category: 'Reading Zone', caption: 'Silent Reading Zone' },
  { src: 'https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg?w=800&h=600&fit=crop', category: 'Infrastructure', caption: 'Reception Area' },
];

export default function GalleryPage() {
  const [active, setActive] = useState('All');
  const [lightbox, setLightbox] = useState<string | null>(null);

  const filtered = active === 'All' ? IMAGES : IMAGES.filter((img) => img.category === active);

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <Badge className="mb-4 bg-white/15 text-white border-white/30">
            <Camera className="w-3 h-3 mr-1.5" />
            Photo Gallery
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">See Our Premium Facilities</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Take a virtual tour of SRS Library — from our spacious AC study hall to dedicated parking and clean washrooms. Every detail is crafted for your comfort.
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="py-10 bg-background border-b border-border sticky top-16 z-10 backdrop-blur-sm bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  active === cat
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-slate-100 dark:bg-slate-800 text-foreground/70 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(({ src, caption, category }, i) => (
              <div
                key={i}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer"
                onClick={() => setLightbox(src)}
              >
                <img src={src} alt={caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                  <p className="text-white font-medium text-sm">{caption}</p>
                  <span className="text-xs text-white/70">{category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            onClick={() => setLightbox(null)}
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={lightbox}
            alt="Gallery"
            className="max-w-full max-h-[90vh] rounded-2xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
