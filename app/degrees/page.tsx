'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { GraduationCap, CheckCircle, ArrowRight, Award, BookOpen, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useSettings, usePrograms } from '@/hooks/use-settings';

const DEFAULT_PROGRAMS = [
  { code: 'BCA', name: 'Bachelor of Computer Applications', duration: '3 Years', eligibility: '10+2 (any stream)', fee: 15000, color: 'blue', description: 'Dive into programming, databases, and IT fundamentals.', careers: ['Software Developer', 'Web Designer', 'Database Admin', 'IT Analyst'] },
  { code: 'BBA', name: 'Bachelor of Business Administration', duration: '3 Years', eligibility: '10+2 (any stream)', fee: 14000, color: 'emerald', description: 'Build a strong business foundation.', careers: ['Business Manager', 'Marketing Executive', 'HR Manager', 'Entrepreneur'] },
  { code: 'BA', name: 'Bachelor of Arts', duration: '3 Years', eligibility: '10+2 (any stream)', fee: 12000, color: 'amber', description: 'Explore humanities, social sciences, and liberal arts.', careers: ['Civil Services', 'Journalism', 'Teaching', 'Content Writer'] },
  { code: 'MBA', name: 'Master of Business Administration', duration: '2 Years', eligibility: 'Graduation in any stream', fee: 20000, color: 'rose', description: 'Executive-level business education.', careers: ['CEO/Manager', 'Consultant', 'Finance Manager', 'Marketing Head'] },
  { code: 'MA', name: 'Master of Arts', duration: '2 Years', eligibility: 'BA or equivalent graduation', fee: 13000, color: 'purple', description: 'Advanced study in humanities and social sciences.', careers: ['Lecturer/Professor', 'Researcher', 'Civil Services', 'Content Specialist'] },
  { code: 'M.Com', name: 'Master of Commerce', duration: '2 Years', eligibility: 'B.Com or equivalent', fee: 14000, color: 'cyan', description: 'Advanced commerce education.', careers: ['CA/CMA Preparation', 'Tax Consultant', 'Finance Manager', 'Auditor'] },
];

const COLOR_MAP: Record<string, string> = {
  blue: 'bg-blue-600',
  emerald: 'bg-emerald-600',
  amber: 'bg-amber-600',
  rose: 'bg-rose-600',
  purple: 'bg-purple-600',
  cyan: 'bg-cyan-600',
  slate: 'bg-slate-600',
};

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone required'),
  course: z.string().min(1, 'Select a course'),
  qualification: z.string().optional(),
  message: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function DegreesPage() {
  const [submitted, setSubmitted] = useState(false);
  const { settings } = useSettings();
  const { programs, loading } = usePrograms();
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const displayPrograms = programs.length > 0 ? programs : DEFAULT_PROGRAMS;
  const badges = (settings.partner_university_badges || '').split(',').filter(Boolean);

  const onSubmit = async (data: FormData) => {
    const { error } = await supabase.from('degree_enquiries').insert({
      name: data.name,
      email: data.email,
      phone: data.phone,
      course: data.course as any,
      qualification: data.qualification || null,
      message: data.message || null,
    });
    if (error) { toast.error('Submission failed. Please try again.'); return; }
    await supabase.from('notifications').insert({
      type: 'enquiry',
      title: `New enquiry: ${data.name} for ${data.course}`,
      body: `Phone: ${data.phone}, Email: ${data.email}`,
    });
    setSubmitted(true);
    toast.success('Enquiry submitted! Our counsellor will contact you within 24 hours.');
  };

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative py-24 bg-gradient-to-br from-slate-900 to-blue-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(214_100%_60%/0.15)_0%,transparent_70%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Admissions Open 2024-25
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            UGC-Approved Online Degrees<br />
            <span className="text-blue-400">from {settings.partner_university_name || 'Mangalayatan University'}</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-3xl mx-auto mb-8">
            Earn a recognized university degree online while continuing your job or studies. DEB recognized, UGC approved — valid for government jobs and further education.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            {[
              { icon: Award, label: 'UGC Approved' },
              { icon: CheckCircle, label: 'DEB Recognized' },
              { icon: Users, label: `${settings.stat_members || '500+'} Enrolled` },
              { icon: BookOpen, label: `${displayPrograms.length} Programs` },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20">
                <Icon className="w-4 h-4 text-blue-300" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* University info */}
      <section className="py-14 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3">Partner University: {settings.partner_university_name || 'Mangalayatan University'}</h2>
              <p className="text-blue-100 leading-relaxed">
                {settings.partner_university_description || 'Mangalayatan University is a UGC-approved university recognized by the Distance Education Bureau (DEB). Degrees are valid for government jobs, higher education (M.Phil/Ph.D), and corporate employment — on par with regular degrees.'}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              {badges.map((tag) => (
                <span key={tag} className="px-4 py-2 rounded-full bg-white/15 border border-white/30 text-sm font-medium">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Courses */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">Programs Offered</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Choose Your Program</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Career-focused programs to match your goals. All programs are fully online and UGC approved.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayPrograms.map((prog) => (
              <div key={prog.code} className="bg-white dark:bg-slate-900 rounded-2xl border border-border shadow-sm card-hover overflow-hidden">
                <div className={`${COLOR_MAP[prog.color] || 'bg-blue-600'} p-6 text-white`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-3xl font-bold">{prog.code}</p>
                      <p className="text-sm text-white/80 mt-1">{prog.name}</p>
                    </div>
                    <Badge className="bg-white/20 text-white border-white/30 text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {prog.duration}
                    </Badge>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm text-muted-foreground mb-4">{prog.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Eligibility</span>
                      <span className="font-medium text-foreground">{prog.eligibility}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Fee</span>
                      <span className="font-medium text-foreground">₹{prog.fee.toLocaleString()}/year</span>
                    </div>
                  </div>
                  <div className="mb-5">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Career Options</p>
                    <div className="flex flex-wrap gap-1.5">
                      {prog.careers.map((c: string) => (
                        <span key={c} className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-foreground/70">{c}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/courses/${prog.code.toLowerCase()}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full rounded-xl text-xs">
                        Learn More
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs"
                      onClick={() => {
                        setValue('course', prog.code);
                        document.getElementById('counselling')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      Apply Now
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Admission process */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950/50" id="process">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">How it Works</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Simple 4-Step Process</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Enquire', desc: 'Fill the form or call us. Our counsellor will guide you on course selection.' },
              { step: '02', title: 'Apply', desc: 'Submit your application form with required documents online.' },
              { step: '03', title: 'Pay Fee', desc: 'Our counsellor will share fee details and guide you through the payment process.' },
              { step: '04', title: 'Start Learning', desc: 'Receive your student ID and access the LMS to begin your degree.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-border shadow-sm relative">
                <div className="text-5xl font-black text-blue-100 dark:text-blue-950 mb-4">{step}</div>
                <h3 className="font-bold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry Form */}
      <section className="py-20 bg-background" id="counselling">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-border shadow-xl">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Enquiry Submitted!</h3>
                <p className="text-muted-foreground">Our education counsellor will call you within 24 hours to guide you through the admission process.</p>
                <Button className="mt-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setSubmitted(false)}>Submit Another</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="text-center mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Free Counselling</h3>
                  <p className="text-muted-foreground text-sm mt-1">Get expert guidance — completely free. No commitment required.</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name</Label>
                    <Input {...register('name')} placeholder="Your full name" className="mt-1.5 rounded-xl" />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    <Input {...register('phone')} placeholder="+91 98765 43210" className="mt-1.5 rounded-xl" />
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                  </div>
                </div>
                <div>
                  <Label>Email Address</Label>
                  <Input type="email" {...register('email')} placeholder="you@example.com" className="mt-1.5 rounded-xl" />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <Label>Course Interested In</Label>
                  <Select onValueChange={(v) => setValue('course', v)}>
                    <SelectTrigger className="mt-1.5 rounded-xl">
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {displayPrograms.map((p) => (
                        <SelectItem key={p.code} value={p.code}>
                          {p.code} — {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.course && <p className="text-xs text-red-500 mt-1">{errors.course.message}</p>}
                </div>
                <div>
                  <Label>Current Qualification</Label>
                  <Input {...register('qualification')} placeholder="e.g., 12th pass, Graduation" className="mt-1.5 rounded-xl" />
                </div>
                <div>
                  <Label>Message (Optional)</Label>
                  <Textarea {...register('message')} placeholder="Any specific questions or requirements?" rows={3} className="mt-1.5 rounded-xl resize-none" />
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 h-12">
                  {isSubmitting ? 'Submitting...' : (
                    <>
                      Get Free Counselling <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Free consultation. No hidden charges. 100% confidential.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
