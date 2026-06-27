'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  AirVent, Wifi, ShieldCheck, Zap, ParkingSquare, Bath,
  Volume2, Users, CheckCircle, Star, ArrowRight, BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useSettings, usePlans } from '@/hooks/use-settings';

const AMENITIES = [
  { icon: AirVent, label: 'Fully AC' },
  { icon: Wifi, label: 'High-Speed WiFi' },
  { icon: ShieldCheck, label: 'CCTV 24x7' },
  { icon: Zap, label: 'Power Backup' },
  { icon: ParkingSquare, label: 'Free Parking' },
  { icon: Bath, label: 'Clean Washrooms' },
  { icon: Volume2, label: 'Silent Zone' },
  { icon: Users, label: 'Premium Seats' },
];

const DEFAULT_PLANS = [
  { plan_key: 'daily', name: 'Daily Pass', price: 49, duration: '1 Day', badge: null, badge_color: 'slate', features: ['Single Day Access', 'AC Environment', 'WiFi Included', 'Individual Desk', 'CCTV Security'] },
  { plan_key: 'weekly', name: 'Weekly Pass', price: 249, duration: '7 Days', badge: null, badge_color: 'blue', features: ['7 Days Access', 'AC Environment', 'WiFi Included', 'Individual Desk', 'CCTV Security', 'Power Backup'] },
  { plan_key: 'monthly', name: 'Monthly Pass', price: 799, duration: '30 Days', badge: 'Most Popular', badge_color: 'blue', features: ['30 Days Access', 'AC Environment', 'WiFi Included', 'Individual Desk', 'CCTV Security', 'Power Backup', 'Priority Seat'] },
  { plan_key: 'quarterly', name: 'Quarterly Pass', price: 1999, duration: '90 Days', badge: 'Best Value', badge_color: 'green', features: ['90 Days Access', 'AC Environment', 'WiFi Included', 'Individual Desk', 'CCTV Security', 'Power Backup', 'Priority Seat', 'Free Study Material'] },
];

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone required'),
  plan: z.string().min(1, 'Select a plan'),
});
type FormData = z.infer<typeof schema>;

export default function LibraryPage() {
  const [submitted, setSubmitted] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const { settings } = useSettings();
  const { plans, loading } = usePlans();
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { plan: 'monthly' },
  });

  const displayPlans = plans.length > 0 ? plans : DEFAULT_PLANS;

  const onSubmit = async (data: FormData) => {
    const plan = displayPlans.find((p) => p.plan_key === data.plan);
    const { error } = await supabase.from('library_memberships').insert({
      name: data.name,
      email: data.email,
      phone: data.phone,
      plan: data.plan,
      amount: plan?.price || 0,
      payment_status: 'pending',
    });
    if (error) { toast.error('Registration failed. Please try again.'); return; }
    await supabase.from('notifications').insert({
      type: 'membership',
      title: `New membership: ${data.name} (${data.plan})`,
      body: `Phone: ${data.phone}, Email: ${data.email}`,
    });
    setSubmitted(true);
    toast.success('Membership registered! We will contact you to confirm your seat.');
  };

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(214_100%_70%/0.2)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(hsl(0_0%_100%/0.03)_1px,transparent_1px),linear-gradient(90deg,hsl(0_0%_100%/0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-6 bg-white/15 text-white border-white/30 text-xs uppercase tracking-wider">
            <BookOpen className="w-3 h-3 mr-1.5" />
            Premium Study Library
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Your Perfect Study Space<br />Awaits You
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8">
            Premium AC study seats, high-speed WiFi, CCTV security, 24x7 power backup and a completely peaceful environment — designed for serious learners.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {AMENITIES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-full text-sm">
                <Icon className="w-3.5 h-3.5" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Library Images */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'https://images.pexels.com/photos/3184328/pexels-photo-3184328.jpeg?w=600&h=400&fit=crop',
              'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?w=600&h=400&fit=crop',
              'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?w=600&h=400&fit=crop',
              'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?w=600&h=400&fit=crop',
              'https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?w=600&h=400&fit=crop',
              'https://images.pexels.com/photos/2041627/pexels-photo-2041627.jpeg?w=600&h=400&fit=crop',
            ].map((src, i) => (
              <div key={i} className="rounded-2xl overflow-hidden aspect-video">
                <img src={src} alt="Library" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950/50" id="membership">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">Membership Plans</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Choose Your Plan</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Flexible membership plans to match your study schedule. All plans include access to all facilities.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
            {displayPlans.map((plan) => (
              <div
                key={plan.plan_key}
                onClick={() => {
                  setSelectedPlan(plan.plan_key);
                  setValue('plan', plan.plan_key);
                  document.getElementById('register-form')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`relative bg-white dark:bg-slate-900 rounded-2xl p-6 border-2 cursor-pointer transition-all duration-200 ${
                  selectedPlan === plan.plan_key
                    ? 'border-blue-500 shadow-xl shadow-blue-500/15 scale-[1.02]'
                    : 'border-slate-200 shadow-sm hover:shadow-md'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${plan.badge_color === 'blue' ? 'bg-blue-600' : plan.badge_color === 'green' ? 'bg-green-600' : 'bg-slate-600'}`}>
                      {plan.badge}
                    </span>
                  </div>
                )}
                <div className="mb-4">
                  <p className="text-sm font-medium text-muted-foreground mb-1">{plan.name}</p>
                  <p className="text-4xl font-bold text-foreground">₹{plan.price}</p>
                  <p className="text-sm text-muted-foreground">per {plan.duration}</p>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f: string) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full rounded-xl text-sm ${
                    selectedPlan === plan.plan_key
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-foreground hover:bg-blue-50'
                  }`}
                  onClick={(e) => { e.stopPropagation(); setSelectedPlan(plan.plan_key); setValue('plan', plan.plan_key); document.getElementById('register-form')?.scrollIntoView({ behavior: 'smooth' }); }}
                >
                  {selectedPlan === plan.plan_key ? 'Selected ✓' : 'Select Plan'}
                </Button>
              </div>
            ))}
          </div>

          {/* Registration Form */}
          <div id="register-form" className="max-w-xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-8 border border-border shadow-xl">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Registration Successful!</h3>
                <p className="text-muted-foreground">We will contact you within 2 hours to confirm your seat and process payment.</p>
                <Button className="mt-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setSubmitted(false)}>
                  Register Another
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-1">Register for Membership</h3>
                  <p className="text-sm text-muted-foreground">
                    Selected: <span className="font-semibold text-blue-600">{displayPlans.find((p) => p.plan_key === selectedPlan)?.name}</span>
                  </p>
                </div>
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
                <div>
                  <Label>Email Address</Label>
                  <Input type="email" {...register('email')} placeholder="you@example.com" className="mt-1.5 rounded-xl" />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                </div>
                <input type="hidden" {...register('plan')} />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 h-12"
                >
                  {isSubmitting ? 'Processing...' : (
                    <>
                      Register Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  We will contact you within 2 hours to confirm seat availability.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Stats / Why choose us */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-6">
              <p className="text-4xl font-bold text-blue-600">{settings.stat_seats || 'Premium'}</p>
              <p className="text-muted-foreground mt-1">Study Seats</p>
            </div>
            <div className="p-6">
              <p className="text-4xl font-bold text-blue-600">{settings.stat_members || '500+'}</p>
              <p className="text-muted-foreground mt-1">Happy Members</p>
            </div>
            <div className="p-6">
              <p className="text-4xl font-bold text-blue-600">{settings.stat_rating || '5.0'}</p>
              <p className="text-muted-foreground mt-1">Google Rating</p>
            </div>
            <div className="p-6">
              <p className="text-4xl font-bold text-blue-600">{settings.stat_years || '3+'}</p>
              <p className="text-muted-foreground mt-1">Years Running</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">What Members Say</h2>
            <div className="flex justify-center items-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
              <span className="ml-2 font-semibold">{settings.stat_rating || '5.0'} · {settings.stat_reviews || '200+'} reviews</span>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Priya S.', text: 'The peaceful environment here helped me crack UPSC prelims. Best library in the city!', img: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=60&h=60&fit=crop' },
              { name: 'Rahul V.', text: 'WiFi is blazing fast, AC is perfect, and the individual desks with charging ports are a lifesaver.', img: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=60&h=60&fit=crop' },
              { name: 'Sneha P.', text: 'The CCTV and 24x7 power backup mean I can study late without worry. Totally worth it!', img: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?w=60&h=60&fit=crop' },
            ].map(({ name, text, img }) => (
              <div key={name} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-border shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <img src={img} alt={name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-sm text-foreground">{name}</p>
                    <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
