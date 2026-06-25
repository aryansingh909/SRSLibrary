'use client';

import { useEffect, useState } from 'react';
import { Star, Quote } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Review {
  id: string;
  name: string;
  role: string | null;
  rating: number;
  review: string;
  service: string | null;
}

const FALLBACK_REVIEWS: Review[] = [
  { id: '1', name: 'Priya Sharma', role: 'UPSC Aspirant', rating: 5, review: 'The peaceful environment at this library helped me crack my prelims. The AC, clean washrooms and 24x7 power backup are a game changer!', service: 'library' },
  { id: '2', name: 'Rahul Verma', role: 'B.Tech Student', rating: 5, review: 'Best study library in the area. The individual desks and high-speed WiFi make it perfect for serious studying. Highly recommend!', service: 'library' },
  { id: '3', name: 'Anjali Singh', role: 'MBA Graduate', rating: 5, review: 'Got admitted to MBA at Mangalayatan University through their counselling. The team guided me through every step of the process. Very professional!', service: 'degree' },
  { id: '4', name: 'Amit Kumar', role: 'BCA Student', rating: 4, review: 'Enrolled for BCA online degree and the counsellors were extremely helpful. The fee structure is affordable and the university is UGC approved.', service: 'degree' },
  { id: '5', name: 'Sneha Patel', role: 'CA Aspirant', rating: 5, review: 'The study environment here is second to none. Quiet, clean and the CCTV makes me feel safe even during late-night study sessions.', service: 'library' },
  { id: '6', name: 'Vikram Joshi', role: 'MBA Aspirant', rating: 5, review: 'Both services — the library and the degree guidance — are top notch. Worth every rupee. My career is on the right track now!', service: 'both' },
];

const AVATARS = [
  'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=80&h=80&fit=crop',
  'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=80&h=80&fit=crop',
  'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?w=80&h=80&fit=crop',
  'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=80&h=80&fit=crop',
  'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?w=80&h=80&fit=crop',
  'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=80&h=80&fit=crop',
];

const SERVICE_BADGE: Record<string, { label: string; cls: string }> = {
  library: { label: 'Library Member', cls: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400' },
  degree: { label: 'Degree Student', cls: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400' },
  both: { label: 'Library + Degree', cls: 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-400' },
};

export default function TestimonialsSection() {
  const [reviews, setReviews] = useState<Review[]>(FALLBACK_REVIEWS);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('reviews')
        .select('id,name,role,rating,review,service')
        .eq('approved', true)
        .order('created_at', { ascending: false })
        .limit(6);
      if (data && data.length > 0) setReviews(data);
    })();
  }, []);

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">Testimonials</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            What Our Students Say
          </h2>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="font-semibold text-foreground">5.0</span>
            <span className="text-muted-foreground text-sm">· Based on 500+ reviews</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <div
              key={review.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-border shadow-sm card-hover relative"
            >
              <Quote className="absolute top-4 right-5 w-8 h-8 text-blue-100 dark:text-blue-950" />
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={AVATARS[i % AVATARS.length]}
                  alt={review.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-border"
                />
                <div>
                  <p className="font-semibold text-foreground text-sm">{review.name}</p>
                  {review.role && <p className="text-xs text-muted-foreground">{review.role}</p>}
                </div>
              </div>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    className={`w-4 h-4 ${j < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{review.review}</p>
              {review.service && SERVICE_BADGE[review.service] && (
                <span className={`inline-block mt-3 px-2.5 py-1 rounded-full text-xs font-medium ${SERVICE_BADGE[review.service].cls}`}>
                  {SERVICE_BADGE[review.service].label}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
