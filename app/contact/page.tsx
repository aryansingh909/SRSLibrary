'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useSettings } from '@/hooks/use-settings';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(1),
  message: z.string().min(10),
});
type FormData = z.infer<typeof schema>;

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const { settings } = useSettings();
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const { error } = await supabase.from('contact_requests').insert({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      subject: data.subject,
      message: data.message,
    });
    if (error) { toast.error('Failed to send. Please try again.'); return; }
    await supabase.from('notifications').insert({
      type: 'contact',
      title: `New contact: ${data.name}`,
      body: data.message.slice(0, 120),
    });
    setSubmitted(true);
    toast.success('Message sent successfully!');
  };

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <Badge className="mb-4 bg-white/15 text-white border-white/30">Contact Us</Badge>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">We Would Love to Hear from You</h1>
          <p className="text-blue-100 text-lg">
            Questions about library membership, degree admissions, or just want to visit us? We respond within 24 hours.
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Contact info */}
            <div className="space-y-5">
              <h2 className="text-2xl font-bold text-foreground">Get in Touch</h2>
              {[
                { icon: Phone, title: 'Phone', lines: ['+91 9415660616', 'Mon–Sat, 8 AM – 8 PM'], href: 'tel:+91 8736974085', color: 'bg-blue-600' },
                { icon: Mail, title: 'Email', lines: ['Krishnakumarsingh909@gmail.com', 'We reply within 24 hours'], href: 'mailto:hello@studynest.in', color: 'bg-green-600' },
                { icon: MessageCircle, title: 'WhatsApp', lines: ['+91 9415660616', 'Quick responses'], href: 'https://wa.me/919415660616', color: 'bg-[#25D366]' },
                { icon: MapPin, title: 'Address', lines: ['123, Main Market Road', 'Your City, State — 000000'], href: '#map', color: 'bg-rose-600' },
                { icon: Clock, title: 'Library Hours', lines: ['Monday to Saturday', '7:00 AM — 10:00 PM'], href: '#', color: 'bg-amber-600' },
              ].map(({ icon: Icon, title, lines, href, color }) => (
                <a key={title} href={href} className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm hover:shadow-md transition-shadow group">
                  <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{title}</p>
                    {lines.map((l) => <p key={l} className="text-xs text-muted-foreground">{l}</p>)}
                  </div>
                </a>
              ))}

              {/* Social / WhatsApp CTA */}
              <div className="p-5 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30">
                <p className="font-semibold text-foreground mb-2">Chat on WhatsApp</p>
                <p className="text-sm text-muted-foreground mb-3">Get instant answers to your questions</p>
                <a href="https://wa.me/919415660616?text=Hello%2C%20I%20want%20to%20know%20more%20about%20your%20services." target="_blank" rel="noopener noreferrer">
                  <Button className="w-full rounded-xl bg-[#25D366] hover:bg-[#20BD5C] text-white">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Open WhatsApp
                  </Button>
                </a>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-border shadow-xl">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground">We will get back to you within 24 hours.</p>
                    <Button className="mt-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setSubmitted(false)}>
                      Send Another
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-1">Send Us a Message</h3>
                      <p className="text-sm text-muted-foreground">Fill in the form and we will respond within 24 hours.</p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label>Full Name <span className="text-red-500">*</span></Label>
                        <Input {...register('name')} placeholder="Your full name" className="mt-1.5 rounded-xl" />
                        {errors.name && <p className="text-xs text-red-500 mt-1">Required</p>}
                      </div>
                      <div>
                        <Label>Phone Number</Label>
                        <Input {...register('phone')} placeholder="+91 98765 43210" className="mt-1.5 rounded-xl" />
                      </div>
                    </div>
                    <div>
                      <Label>Email Address <span className="text-red-500">*</span></Label>
                      <Input type="email" {...register('email')} placeholder="you@example.com" className="mt-1.5 rounded-xl" />
                      {errors.email && <p className="text-xs text-red-500 mt-1">Valid email required</p>}
                    </div>
                    <div>
                      <Label>Subject <span className="text-red-500">*</span></Label>
                      <Select onValueChange={(v) => setValue('subject', v)}>
                        <SelectTrigger className="mt-1.5 rounded-xl">
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Library Membership Enquiry">Library Membership Enquiry</SelectItem>
                          <SelectItem value="Degree Admission Enquiry">Degree Admission Enquiry</SelectItem>
                          <SelectItem value="Course Information">Course Information</SelectItem>
                          <SelectItem value="Fee Structure">Fee Structure</SelectItem>
                          <SelectItem value="General Query">General Query</SelectItem>
                          <SelectItem value="Feedback">Feedback</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.subject && <p className="text-xs text-red-500 mt-1">Please select a subject</p>}
                    </div>
                    <div>
                      <Label>Message <span className="text-red-500">*</span></Label>
                      <Textarea {...register('message')} placeholder="Write your message here..." rows={5} className="mt-1.5 rounded-xl resize-none" />
                      {errors.message && <p className="text-xs text-red-500 mt-1">Message too short</p>}
                    </div>
                    <Button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 h-12">
                      {isSubmitting ? 'Sending...' : (
                        <><Send className="w-4 h-4 mr-2" />Send Message</>
                      )}
                    </Button>
                  </form>
                )}
              </div>

              {/* Map */}
              <div id="map" className="mt-6 rounded-2xl overflow-hidden border border-border shadow-sm h-[400px]">
                <iframe
                  src={settings.google_maps_embed_url || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3598.6653282642355!2d82.48075357485!3d25.582798915975534!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399019007038cfe9%3A0x74a143c5f33ac72b!2sSRS%20Digital%20Library!5e0!3m2!1sen!2sin!4v1782629105042!5m2!1sen!2sin'}
                  className="w-full h-full"
                  style={{ border: 0 }}
                  loading="lazy"
                  scrolling="no"
                  title="SRS Library Location"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
