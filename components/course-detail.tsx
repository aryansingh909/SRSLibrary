'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle, Clock, BookOpen, Briefcase, HelpCircle, ArrowRight, GraduationCap, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useSettings } from '@/hooks/use-settings';
import type { CourseData } from '@/app/courses/[slug]/page';

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email(),
  qualification: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function CourseDetailPage({ course }: { course: CourseData }) {
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { settings } = useSettings();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const { error } = await supabase.from('degree_enquiries').insert({
      name: data.name,
      email: data.email,
      phone: data.phone,
      course: course.code as any,
      qualification: data.qualification || null,
    });
    if (error) { toast.error('Submission failed. Please try again.'); return; }
    await supabase.from('notifications').insert({
      type: 'enquiry',
      title: `New enquiry: ${data.name} for ${course.code}`,
      body: `Phone: ${data.phone}`,
    });
    setSubmitted(true);
    toast.success('Enquiry submitted! We will contact you within 24 hours.');
  };

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className={`relative py-24 bg-gradient-to-br ${course.color} text-white overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0" style={{ backgroundImage: `url(${course.image})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.15 }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Link href="/degrees" className="inline-flex items-center gap-1.5 text-white/70 text-sm mb-6 hover:text-white transition-colors">
              ← All Programs
            </Link>
            <Badge className="mb-4 bg-white/20 text-white border-white/30">{course.approval}</Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              {course.code}
            </h1>
            <p className="text-xl text-white/90 mb-2">{course.name}</p>
            <p className="text-2xl font-light text-white/70 italic mb-6">"{course.tagline}"</p>
            <div className="flex flex-wrap gap-3 text-sm">
              {[
                { icon: Clock, label: course.duration },
                { icon: BookOpen, label: course.mode },
                { icon: GraduationCap, label: course.university },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/15 rounded-full border border-white/20">
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Overview */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Program Overview</h2>
              <p className="text-muted-foreground leading-relaxed">{course.description}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                {[
                  { label: 'Duration', value: course.duration },
                  { label: 'Mode', value: course.mode },
                  { label: 'Fee', value: course.fee },
                  { label: 'University', value: course.university },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-border">
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">{label}</p>
                    <p className="font-semibold text-foreground text-sm">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Eligibility */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-500" />
                Eligibility
              </h2>
              <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl p-5">
                <p className="text-green-800 dark:text-green-300 font-medium">{course.eligibility}</p>
              </div>
            </div>

            {/* Subjects */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-blue-600" />
                Key Subjects
              </h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {course.subjects.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-border text-sm">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    {s}
                  </div>
                ))}
              </div>
            </div>

            {/* Careers */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-blue-600" />
                Career Opportunities
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {course.careers.map(({ title, salary }) => (
                  <div key={title} className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-border shadow-sm">
                    <p className="font-semibold text-foreground text-sm mb-1">{title}</p>
                    <p className="text-xs text-blue-600 font-medium">{salary}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-blue-600" />
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {course.faqs.map(({ q, a }, i) => (
                  <div key={i} className="bg-white dark:bg-slate-900 rounded-xl border border-border overflow-hidden">
                    <button
                      className="w-full text-left p-5 flex items-center justify-between gap-3 font-medium text-foreground text-sm"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    >
                      {q}
                      {openFaq === i ? <ChevronUp className="w-4 h-4 flex-shrink-0 text-blue-600" /> : <ChevronDown className="w-4 h-4 flex-shrink-0" />}
                    </button>
                    {openFaq === i && (
                      <div className="px-5 pb-5 text-sm text-muted-foreground">{a}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar: Enquiry form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white dark:bg-slate-900 rounded-2xl border border-border shadow-xl p-6">
              {submitted ? (
                <div className="text-center py-6">
                  <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-7 h-7 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Enquiry Sent!</h3>
                  <p className="text-sm text-muted-foreground">Our counsellor will call you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Apply for {course.code}</h3>
                    <p className="text-xs text-muted-foreground mt-1">Free counselling — no commitment.</p>
                  </div>
                  <div>
                    <Label className="text-xs">Full Name</Label>
                    <Input {...register('name')} placeholder="Your name" className="mt-1 rounded-xl text-sm" />
                    {errors.name && <p className="text-xs text-red-500 mt-1">Required</p>}
                  </div>
                  <div>
                    <Label className="text-xs">Phone</Label>
                    <Input {...register('phone')} placeholder="+91 98765 43210" className="mt-1 rounded-xl text-sm" />
                    {errors.phone && <p className="text-xs text-red-500 mt-1">Required</p>}
                  </div>
                  <div>
                    <Label className="text-xs">Email</Label>
                    <Input type="email" {...register('email')} placeholder="you@email.com" className="mt-1 rounded-xl text-sm" />
                    {errors.email && <p className="text-xs text-red-500 mt-1">Valid email required</p>}
                  </div>
                  <div>
                    <Label className="text-xs">Current Qualification</Label>
                    <Input {...register('qualification')} placeholder="e.g., 12th pass" className="mt-1 rounded-xl text-sm" />
                  </div>
                  <Button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25">
                    {isSubmitting ? 'Submitting...' : (
                      <>Get Free Counselling <ArrowRight className="w-3.5 h-3.5 ml-1.5" /></>
                    )}
                  </Button>
                </form>
              )}
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-center text-muted-foreground">Or call us directly</p>
                <a href={`tel:${(settings.phone_primary || '+919999999999').replace(/\s/g, '')}`} className="block text-center text-blue-600 font-semibold text-sm mt-1 hover:text-blue-700">
                  {settings.phone_primary || '+91 99999 99999'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
