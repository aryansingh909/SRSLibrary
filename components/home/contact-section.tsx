'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useSettings } from '@/hooks/use-settings';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});
type FormData = z.infer<typeof schema>;

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const { settings } = useSettings();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const { error } = await supabase.from('contact_requests').insert({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      message: data.message,
      subject: 'Website Contact Form',
    });
    if (error) {
      toast.error('Failed to send message. Please try again.');
      return;
    }
    await supabase.from('notifications').insert({
      type: 'contact',
      title: `New contact from ${data.name}`,
      body: data.message.slice(0, 120),
    });
    setSubmitted(true);
    toast.success('Message sent! We will get back to you shortly.');
  };

  return (
    <section id="contact" className="py-20 bg-slate-50 dark:bg-slate-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">Get in Touch</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">We Are Here to Help</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Have questions about our library plans or need guidance on online degree admissions? Reach out — we respond within 24 hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Info */}
          <div>
            <div className="space-y-4 mb-8">
              {[
                { icon: Phone, label: 'Call Us', value: settings.phone_primary || '+91 99999 99999', href: `tel:${(settings.phone_primary || '+919999999999').replace(/\s/g, '')}`, color: 'bg-blue-600' },
                { icon: Mail, label: 'Email Us', value: settings.email || 'hello@studynest.in', href: `mailto:${settings.email || 'hello@studynest.in'}`, color: 'bg-green-600' },
                { icon: MessageCircle, label: 'WhatsApp', value: settings.whatsapp_number || '+91 99999 99999', href: `https://wa.me/${(settings.whatsapp_number || '+919999999999').replace(/\D/g, '')}`, color: 'bg-[#25D366]' },
                { icon: MapPin, label: 'Visit Us', value: settings.address || '123, Main Market Road, Your City — 000000', href: '#map', color: 'bg-rose-600' },
              ].map(({ icon: Icon, label, value, href, color }) => (
                <a
                  key={label}
                  href={href}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
                    <p className="text-sm font-semibold text-foreground">{value}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Map */}
            <div id="map" className="rounded-2xl overflow-hidden border border-border shadow-sm h-[400px]">
              <iframe
                src={settings.google_maps_embed_url || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.0!2d77.2!3d28.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM2JzAwLjAiTiA3N8KwMTInMDAuMCJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin'}
                className="w-full h-full"
                style={{ border: 0 }}
                loading="lazy"
                scrolling="no"
                title="SRS Library Location"
              />
            </div>
          </div>

          {/* Form */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-border shadow-xl">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Message Sent!</h3>
                <p className="text-muted-foreground">Thank you for reaching out. We will get back to you within 24 hours.</p>
                <Button
                  className="mt-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setSubmitted(false)}
                >
                  Send Another
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-1">Send a Message</h3>
                  <p className="text-sm text-muted-foreground">Fill in the form and we will respond shortly.</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                    <Input id="name" {...register('name')} placeholder="Your name" className="mt-1.5 rounded-xl" />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                    <Input id="phone" {...register('phone')} placeholder="+91 98765 43210" className="mt-1.5 rounded-xl" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <Input id="email" type="email" {...register('email')} placeholder="you@example.com" className="mt-1.5 rounded-xl" />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <Label htmlFor="message" className="text-sm font-medium">Message</Label>
                  <Textarea id="message" {...register('message')} placeholder="How can we help you?" rows={4} className="mt-1.5 rounded-xl resize-none" />
                  {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>}
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 h-12"
                >
                  {isSubmitting ? 'Sending...' : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
