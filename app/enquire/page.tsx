'use client';

import { useEffect, useState } from 'react';
import {
  Inbox, Mail, Phone, GraduationCap, Calendar, Filter, X, Eye, Trash2,
  MessageCircle, BookOpen, RefreshCw, ExternalLink, Search, ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

const DEFAULT_PASSWORD = 'admin123';

type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  qualification: string | null;
  message: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
};

type ContactRequest = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
};

type Membership = {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: string;
  start_date: string | null;
  end_date: string | null;
  seat_number: number | null;
  amount: number | null;
  payment_status: string;
  status: string;
  created_at: string;
};

const ENQUIRY_STATUSES = ['new', 'contacted', 'enrolled', 'rejected', 'closed'];
const CONTACT_STATUSES = ['new', 'in_progress', 'resolved', 'closed'];
const MEMBERSHIP_STATUSES = ['active', 'expired', 'cancelled'];

const statusColor = (status: string) => {
  if (status === 'new') return 'bg-blue-500 text-white';
  if (status === 'contacted' || status === 'in_progress') return 'bg-amber-500 text-white';
  if (status === 'enrolled' || status === 'resolved' || status === 'active') return 'bg-green-500 text-white';
  if (status === 'rejected' || status === 'failed' || status === 'cancelled') return 'bg-red-500 text-white';
  return 'bg-gray-500 text-white';
};

export default function EnquirePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'enquiries' | 'contacts' | 'memberships'>('enquiries');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [contacts, setContacts] = useState<ContactRequest[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);

  const [enquiryFilter, setEnquiryFilter] = useState<string>('all');
  const [contactFilter, setContactFilter] = useState<string>('all');
  const [membershipFilter, setMembershipFilter] = useState<string>('all');

  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [selectedContact, setSelectedContact] = useState<ContactRequest | null>(null);
  const [selectedMembership, setSelectedMembership] = useState<Membership | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem('adminAuth');
    if (saved === 'true') {
      setIsAuthenticated(true);
      loadAllData();
    }
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([loadEnquiries(), loadContacts(), loadMemberships()]);
    } finally {
      setLoading(false);
    }
  };

  const loadEnquiries = async () => {
    const { data, error } = await supabase
      .from('degree_enquiries')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setEnquiries(data as Enquiry[]);
  };

  const loadContacts = async () => {
    const { data, error } = await supabase
      .from('contact_requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setContacts(data as ContactRequest[]);
  };

  const loadMemberships = async () => {
    const { data, error } = await supabase
      .from('library_memberships')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setMemberships(data as Membership[]);
  };

  const handleLogin = async () => {
    try {
      const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'admin_password')
        .maybeSingle();
      const validPassword = data?.value || DEFAULT_PASSWORD;
      if (password === validPassword) {
        setIsAuthenticated(true);
        sessionStorage.setItem('adminAuth', 'true');
        sessionStorage.setItem('adminSessionPw', password);
        loadAllData();
      } else {
        toast.error('Invalid password');
      }
    } catch {
      toast.error('Login failed. Please try again.');
    }
  };

  const updateEnquiryStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('degree_enquiries')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (!error) {
      setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status } : e));
      if (selectedEnquiry?.id === id) setSelectedEnquiry(prev => prev ? { ...prev, status } : prev);
      toast.success('Status updated');
    } else toast.error('Failed to update status');
  };

  const updateContactStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('contact_requests')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (!error) {
      setContacts(prev => prev.map(c => c.id === id ? { ...c, status } : c));
      if (selectedContact?.id === id) setSelectedContact(prev => prev ? { ...prev, status } : prev);
      toast.success('Status updated');
    } else toast.error('Failed to update status');
  };

  const updateMembershipStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('library_memberships')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (!error) {
      setMemberships(prev => prev.map(m => m.id === id ? { ...m, status } : m));
      if (selectedMembership?.id === id) setSelectedMembership(prev => prev ? { ...prev, status } : prev);
      toast.success('Status updated');
    } else toast.error('Failed to update status');
  };

  const deleteEnquiry = async (id: string) => {
    if (!confirm('Delete this enquiry?')) return;
    const { error } = await supabase.from('degree_enquiries').delete().eq('id', id);
    if (!error) {
      setEnquiries(prev => prev.filter(e => e.id !== id));
      if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
      toast.success('Enquiry deleted');
    } else toast.error('Failed to delete');
  };

  const deleteContact = async (id: string) => {
    if (!confirm('Delete this contact request?')) return;
    const { error } = await supabase.from('contact_requests').delete().eq('id', id);
    if (!error) {
      setContacts(prev => prev.filter(c => c.id !== id));
      if (selectedContact?.id === id) setSelectedContact(null);
      toast.success('Contact deleted');
    } else toast.error('Failed to delete');
  };

  const deleteMembership = async (id: string) => {
    if (!confirm('Delete this membership record?')) return;
    const { error } = await supabase.from('library_memberships').delete().eq('id', id);
    if (!error) {
      setMemberships(prev => prev.filter(m => m.id !== id));
      if (selectedMembership?.id === id) setSelectedMembership(null);
      toast.success('Membership deleted');
    } else toast.error('Failed to delete');
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const filteredEnquiries = enquiries.filter(e => {
    const matchesFilter = enquiryFilter === 'all' || e.status === enquiryFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q) || e.phone.includes(q) || e.course.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const filteredContacts = contacts.filter(c => {
    const matchesFilter = contactFilter === 'all' || c.status === contactFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || (c.phone || '').includes(q) || c.message.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const filteredMemberships = memberships.filter(m => {
    const matchesFilter = membershipFilter === 'all' || m.status === membershipFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.phone.includes(q) || m.plan.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const newEnquiriesCount = enquiries.filter(e => e.status === 'new').length;
  const newContactsCount = contacts.filter(c => c.status === 'new').length;
  const activeMembershipsCount = memberships.filter(m => m.status === 'active').length;

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
        <Card className="w-full max-w-sm shadow-xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center mx-auto mb-4">
              <Inbox className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Enquiries Manager</CardTitle>
            <CardDescription>Manage student submissions & contacts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
            <Button className="w-full" onClick={handleLogin}>Login</Button>
            <Link href="/admin" className="block text-center text-sm text-muted-foreground hover:text-foreground">
              Go to Content Management →
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-16">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-border sticky top-16 z-30">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center">
                <Inbox className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-foreground">Enquiries Manager</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Student submissions & contact messages</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="outline" size="sm" onClick={loadAllData} disabled={loading} className="h-8">
                <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Link href="/admin">
                <Button variant="outline" size="sm" className="h-8">
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Content Admin
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => { setActiveTab('enquiries'); setSearchQuery(''); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === 'enquiries' ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-slate-900 border border-border hover:bg-accent'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Degree Enquiries
              {newEnquiriesCount > 0 && (
                <Badge className="bg-red-500 text-white text-xs">{newEnquiriesCount}</Badge>
              )}
            </button>
            <button
              onClick={() => { setActiveTab('contacts'); setSearchQuery(''); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === 'contacts' ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-slate-900 border border-border hover:bg-accent'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              Contact Messages
              {newContactsCount > 0 && (
                <Badge className="bg-red-500 text-white text-xs">{newContactsCount}</Badge>
              )}
            </button>
            <button
              onClick={() => { setActiveTab('memberships'); setSearchQuery(''); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === 'memberships' ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-slate-900 border border-border hover:bg-accent'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Library Memberships
              {activeMembershipsCount > 0 && (
                <Badge className="bg-emerald-500 text-white text-xs">{activeMembershipsCount}</Badge>
              )}
            </button>
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, phone..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : (
          <>
            {/* Degree Enquiries Tab */}
            {activeTab === 'enquiries' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Filter:</span>
                  <button
                    onClick={() => setEnquiryFilter('all')}
                    className={`px-3 py-1 rounded-md text-xs font-medium ${enquiryFilter === 'all' ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-slate-900 border border-border'}`}
                  >
                    All ({enquiries.length})
                  </button>
                  {ENQUIRY_STATUSES.map(s => (
                    <button
                      key={s}
                      onClick={() => setEnquiryFilter(s)}
                      className={`px-3 py-1 rounded-md text-xs font-medium capitalize ${enquiryFilter === s ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-slate-900 border border-border'}`}
                    >
                      {s.replace('_', ' ')} ({enquiries.filter(e => e.status === s).length})
                    </button>
                  ))}
                </div>

                {filteredEnquiries.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                      <Inbox className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No enquiries found. When students submit the counselling form on the Degrees page, they will appear here.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {filteredEnquiries.map((enquiry) => (
                      <Card key={enquiry.id} className={enquiry.status === 'new' ? 'border-emerald-500 border-2' : ''}>
                        <CardContent className="py-4">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-base">{enquiry.name}</span>
                                <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">{enquiry.course}</Badge>
                                <Badge className={statusColor(enquiry.status)}>{enquiry.status}</Badge>
                              </div>
                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{enquiry.email}</span>
                                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{enquiry.phone}</span>
                                {enquiry.qualification && <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" />{enquiry.qualification}</span>}
                                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{formatDate(enquiry.created_at)}</span>
                              </div>
                              {enquiry.message && (
                                <p className="text-sm text-muted-foreground bg-muted/50 rounded p-2 mt-2">{enquiry.message}</p>
                              )}
                            </div>
                            <div className="flex flex-col gap-2 sm:items-end">
                              <select
                                value={enquiry.status}
                                onChange={(e) => updateEnquiryStatus(enquiry.id, e.target.value)}
                                className="px-2 py-1 rounded-md border border-input bg-background text-xs"
                              >
                                {ENQUIRY_STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                              </select>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm" onClick={() => setSelectedEnquiry(enquiry)}><Eye className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="sm" className="text-red-500" onClick={() => deleteEnquiry(enquiry.id)}><Trash2 className="w-4 h-4" /></Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Contact Messages Tab */}
            {activeTab === 'contacts' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Filter:</span>
                  <button
                    onClick={() => setContactFilter('all')}
                    className={`px-3 py-1 rounded-md text-xs font-medium ${contactFilter === 'all' ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-slate-900 border border-border'}`}
                  >
                    All ({contacts.length})
                  </button>
                  {CONTACT_STATUSES.map(s => (
                    <button
                      key={s}
                      onClick={() => setContactFilter(s)}
                      className={`px-3 py-1 rounded-md text-xs font-medium capitalize ${contactFilter === s ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-slate-900 border border-border'}`}
                    >
                      {s.replace('_', ' ')} ({contacts.filter(c => c.status === s).length})
                    </button>
                  ))}
                </div>

                {filteredContacts.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                      <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No contact messages found.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {filteredContacts.map((contact) => (
                      <Card key={contact.id} className={contact.status === 'new' ? 'border-emerald-500 border-2' : ''}>
                        <CardContent className="py-4">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-base">{contact.name}</span>
                                {contact.subject && <Badge variant="outline">{contact.subject}</Badge>}
                                <Badge className={statusColor(contact.status)}>{contact.status.replace('_', ' ')}</Badge>
                              </div>
                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{contact.email}</span>
                                {contact.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{contact.phone}</span>}
                                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{formatDate(contact.created_at)}</span>
                              </div>
                              <p className="text-sm text-muted-foreground bg-muted/50 rounded p-2 mt-2">{contact.message}</p>
                            </div>
                            <div className="flex flex-col gap-2 sm:items-end">
                              <select
                                value={contact.status}
                                onChange={(e) => updateContactStatus(contact.id, e.target.value)}
                                className="px-2 py-1 rounded-md border border-input bg-background text-xs"
                              >
                                {CONTACT_STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                              </select>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm" onClick={() => setSelectedContact(contact)}><Eye className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="sm" className="text-red-500" onClick={() => deleteContact(contact.id)}><Trash2 className="w-4 h-4" /></Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Library Memberships Tab */}
            {activeTab === 'memberships' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Filter:</span>
                  <button
                    onClick={() => setMembershipFilter('all')}
                    className={`px-3 py-1 rounded-md text-xs font-medium ${membershipFilter === 'all' ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-slate-900 border border-border'}`}
                  >
                    All ({memberships.length})
                  </button>
                  {MEMBERSHIP_STATUSES.map(s => (
                    <button
                      key={s}
                      onClick={() => setMembershipFilter(s)}
                      className={`px-3 py-1 rounded-md text-xs font-medium capitalize ${membershipFilter === s ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-slate-900 border border-border'}`}
                    >
                      {s} ({memberships.filter(m => m.status === s).length})
                    </button>
                  ))}
                </div>

                {filteredMemberships.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                      <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No library membership registrations found.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {filteredMemberships.map((m) => (
                      <Card key={m.id} className={m.status === 'active' ? 'border-emerald-500 border-2' : ''}>
                        <CardContent className="py-4">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-base">{m.name}</span>
                                <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 capitalize">{m.plan}</Badge>
                                <Badge className={statusColor(m.status)}>{m.status}</Badge>
                                <Badge variant="outline" className={m.payment_status === 'paid' ? 'text-green-600 border-green-600' : 'text-amber-600 border-amber-600'}>
                                  {m.payment_status}
                                </Badge>
                              </div>
                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{m.email}</span>
                                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{m.phone}</span>
                                {m.seat_number && <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />Seat #{m.seat_number}</span>}
                                {m.amount && <span>₹{m.amount}</span>}
                                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{formatDate(m.created_at)}</span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2 sm:items-end">
                              <select
                                value={m.status}
                                onChange={(e) => updateMembershipStatus(m.id, e.target.value)}
                                className="px-2 py-1 rounded-md border border-input bg-background text-xs"
                              >
                                {MEMBERSHIP_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm" onClick={() => setSelectedMembership(m)}><Eye className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="sm" className="text-red-500" onClick={() => deleteMembership(m.id)}><Trash2 className="w-4 h-4" /></Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Enquiry Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Enquiry Details</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setSelectedEnquiry(null)}><X className="w-4 h-4" /></Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div><Label className="font-semibold">Name:</Label><p>{selectedEnquiry.name}</p></div>
              <div><Label className="font-semibold">Email:</Label><p>{selectedEnquiry.email}</p></div>
              <div><Label className="font-semibold">Phone:</Label><p>{selectedEnquiry.phone}</p></div>
              <div><Label className="font-semibold">Course:</Label><p>{selectedEnquiry.course}</p></div>
              <div><Label className="font-semibold">Qualification:</Label><p>{selectedEnquiry.qualification || 'N/A'}</p></div>
              <div><Label className="font-semibold">Message:</Label><p className="text-muted-foreground">{selectedEnquiry.message || 'N/A'}</p></div>
              <div><Label className="font-semibold">Status:</Label><p className="capitalize">{selectedEnquiry.status}</p></div>
              <div><Label className="font-semibold">Submitted:</Label><p>{new Date(selectedEnquiry.created_at).toLocaleString('en-IN')}</p></div>
              <div className="pt-2 flex gap-2">
                <a href={`mailto:${selectedEnquiry.email}`}><Button size="sm" variant="outline"><Mail className="w-4 h-4 mr-1" />Email</Button></a>
                <a href={`tel:${selectedEnquiry.phone}`}><Button size="sm" variant="outline"><Phone className="w-4 h-4 mr-1" />Call</Button></a>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Contact Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Contact Details</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setSelectedContact(null)}><X className="w-4 h-4" /></Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div><Label className="font-semibold">Name:</Label><p>{selectedContact.name}</p></div>
              <div><Label className="font-semibold">Email:</Label><p>{selectedContact.email}</p></div>
              {selectedContact.phone && <div><Label className="font-semibold">Phone:</Label><p>{selectedContact.phone}</p></div>}
              {selectedContact.subject && <div><Label className="font-semibold">Subject:</Label><p>{selectedContact.subject}</p></div>}
              <div><Label className="font-semibold">Message:</Label><p className="text-muted-foreground">{selectedContact.message}</p></div>
              <div><Label className="font-semibold">Status:</Label><p className="capitalize">{selectedContact.status.replace('_', ' ')}</p></div>
              <div><Label className="font-semibold">Submitted:</Label><p>{new Date(selectedContact.created_at).toLocaleString('en-IN')}</p></div>
              <div className="pt-2 flex gap-2">
                <a href={`mailto:${selectedContact.email}`}><Button size="sm" variant="outline"><Mail className="w-4 h-4 mr-1" />Email</Button></a>
                {selectedContact.phone && <a href={`tel:${selectedContact.phone}`}><Button size="sm" variant="outline"><Phone className="w-4 h-4 mr-1" />Call</Button></a>}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Membership Detail Modal */}
      {selectedMembership && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Membership Details</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setSelectedMembership(null)}><X className="w-4 h-4" /></Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div><Label className="font-semibold">Name:</Label><p>{selectedMembership.name}</p></div>
              <div><Label className="font-semibold">Email:</Label><p>{selectedMembership.email}</p></div>
              <div><Label className="font-semibold">Phone:</Label><p>{selectedMembership.phone}</p></div>
              <div><Label className="font-semibold">Plan:</Label><p className="capitalize">{selectedMembership.plan}</p></div>
              {selectedMembership.seat_number && <div><Label className="font-semibold">Seat Number:</Label><p>{selectedMembership.seat_number}</p></div>}
              {selectedMembership.amount && <div><Label className="font-semibold">Amount:</Label><p>₹{selectedMembership.amount}</p></div>}
              <div><Label className="font-semibold">Payment Status:</Label><p className="capitalize">{selectedMembership.payment_status}</p></div>
              <div><Label className="font-semibold">Status:</Label><p className="capitalize">{selectedMembership.status}</p></div>
              {selectedMembership.start_date && <div><Label className="font-semibold">Start Date:</Label><p>{selectedMembership.start_date}</p></div>}
              {selectedMembership.end_date && <div><Label className="font-semibold">End Date:</Label><p>{selectedMembership.end_date}</p></div>}
              <div><Label className="font-semibold">Registered:</Label><p>{new Date(selectedMembership.created_at).toLocaleString('en-IN')}</p></div>
              <div className="pt-2 flex gap-2">
                <a href={`mailto:${selectedMembership.email}`}><Button size="sm" variant="outline"><Mail className="w-4 h-4 mr-1" />Email</Button></a>
                <a href={`tel:${selectedMembership.phone}`}><Button size="sm" variant="outline"><Phone className="w-4 h-4 mr-1" />Call</Button></a>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
