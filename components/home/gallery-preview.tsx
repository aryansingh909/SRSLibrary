'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGallery } from '@/hooks/use-settings';

type GalleryImage = {
  id?: string;
  url: string;
  caption: string | null;
  span_cols: number;
  span_rows: number;
};

const DEFAULT_IMAGES: GalleryImage[] = [
  { id: 'default-1', url: 'https://images.pexels.com/photos/3184328/pexels-photo-3184328.jpeg?w=600&h=400&fit=crop', caption: 'Study Hall', span_cols: 2, span_rows: 2 },
  { id: 'default-2', url: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?w=400&h=300&fit=crop', caption: 'Reading Zone', span_cols: 1, span_rows: 1 },
  { id: 'default-3', url: 'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?w=400&h=300&fit=crop', caption: 'Library Shelves', span_cols: 1, span_rows: 1 },
  { id: 'default-4', url: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?w=400&h=300&fit=crop', caption: 'AC Facilities', span_cols: 1, span_rows: 1 },
  { id: 'default-5', url: 'https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?w=400&h=300&fit=crop', caption: 'Study Desks', span_cols: 1, span_rows: 1 },
];

export default function GalleryPreview() {
  const { images, loading } = useGallery();
  const displayImages: GalleryImage[] = images.length > 0 ? images.slice(0, 5) : DEFAULT_IMAGES;

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">Gallery</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              See Our Premium Space
            </h2>
          </div>
          <Link href="/gallery" className="hidden sm:block">
            <Button variant="outline" className="rounded-xl border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400">
              View All Photos
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[200px]">
          {displayImages.map((img, i) => {
            const spanClass = img.span_cols === 2 ? 'col-span-2' : '';
            const rowClass = img.span_rows === 2 ? 'row-span-2' : '';
            return (
              <div key={img.id || i} className={`relative group rounded-2xl overflow-hidden ${spanClass} ${rowClass}`}>
                <img
                  src={img.url}
                  alt={img.caption || 'Gallery image'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-white font-medium text-sm">{img.caption || 'Gallery'}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-6 sm:hidden">
          <Link href="/gallery">
            <Button variant="outline" className="rounded-xl border-blue-200 text-blue-700">
              View All Photos
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
