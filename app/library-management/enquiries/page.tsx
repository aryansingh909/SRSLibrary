'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Search, Eye, Trash2, Loader2, ChevronLeft, ChevronRight, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  qualification: string | null;
  message: string | null;
  status: string;
  follow_up_date: string | null;
  assigned_to: string | null;
  admin_notes: string | null;
  created_at: string;
}

const ITEMS_PER_PAGE = 10;

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchEnquiries = useCallback(async () => {
    try {
      const res = await fetch('/api/portal/data?type=enquiries');
      const data = await res.json();
      setEnquiries(data.enquiries || []);
    } catch (err) {
      console.error('Failed to fetch enquiries:', err);
      toast.error('Failed to load enquiries');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  const filteredEnquiries = enquiries.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.phone.includes(search);
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    const matchesCourse = courseFilter === 'all' || e.course === courseFilter;
    return matchesSearch && matchesStatus && matchesCourse;
  });

  const totalPages = Math.ceil(filteredEnquiries.length / ITEMS_PER_PAGE);
  const paginatedEnquiries = filteredEnquiries.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdating(id);
    try {
      const res = await fetch('/api/portal/data', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'enquiry', id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setEnquiries(enquiries.map(e => e.id === id ? { ...e, status: newStatus } : e));
        toast.success('Status updated');
      } else {
        toast.error('Failed to update status');
      }
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/portal/data?type=enquiry&id=${deleteId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setEnquiries(enquiries.filter(e => e.id !== deleteId));
        toast.success('Enquiry deleted');
      } else {
        toast.error('Failed to delete');
      }
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-600';
      case 'contacted': return 'bg-amber-600';
      case 'enrolled': return 'bg-emerald-600';
      case 'rejected': return 'bg-red-600';
      case 'closed': return 'bg-slate-600';
      default: return 'bg-slate-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Degree Enquiries</h1>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          <GraduationCap className="w-4 h-4 mr-2" />
          {filteredEnquiries.length} Records
        </Badge>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-10 h-12 text-base"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-full md:w-40 h-12">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="enrolled">Enrolled</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={courseFilter} onValueChange={(v) => { setCourseFilter(v); setPage(1); }}>
              <SelectTrigger className="w-full md:w-40 h-12">
                <SelectValue placeholder="Course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                <SelectItem value="BCA">BCA</SelectItem>
                <SelectItem value="BBA">BBA</SelectItem>
                <SelectItem value="BA">BA</SelectItem>
                <SelectItem value="MBA">MBA</SelectItem>
                <SelectItem value="MA">MA</SelectItem>
                <SelectItem value="M.Com">M.Com</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold hidden md:table-cell">Phone</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Course</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold hidden lg:table-cell">Date</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {paginatedEnquiries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-500">
                      No enquiries found
                    </td>
                  </tr>
                ) : (
                  paginatedEnquiries.map((e) => (
                    <tr key={e.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="px-4 py-4">
                        <div className="font-medium">{e.name}</div>
                        <div className="text-sm text-slate-500">{e.email}</div>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">{e.phone}</td>
                      <td className="px-4 py-4">
                        <Badge variant="outline">{e.course}</Badge>
                      </td>
                      <td className="px-4 py-4">
                        <Select
                          value={e.status}
                          onValueChange={(v) => handleStatusChange(e.id, v)}
                          disabled={updating === e.id}
                        >
                          <SelectTrigger className={`w-32 h-9 ${getStatusColor(e.status)} text-white border-0`}>
                            {updating === e.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <SelectValue />
                            )}
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="enrolled">Enrolled</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-4 text-sm hidden lg:table-cell">
                        {new Date(e.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedEnquiry(e)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setDeleteId(e.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-4 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-500">
                Showing {(page - 1) * ITEMS_PER_PAGE + 1} to {Math.min(page * ITEMS_PER_PAGE, filteredEnquiries.length)} of {filteredEnquiries.length}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="px-4 py-2 text-sm">{page} / {totalPages}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={!!selectedEnquiry} onOpenChange={() => setSelectedEnquiry(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Enquiry Details</DialogTitle>
            <DialogDescription>Full information about this enquiry</DialogDescription>
          </DialogHeader>
          {selectedEnquiry && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-500">Name</label>
                  <p className="text-base">{selectedEnquiry.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500">Phone</label>
                  <p className="text-base">{selectedEnquiry.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500">Email</label>
                  <p className="text-base">{selectedEnquiry.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500">Course</label>
                  <p className="text-base">{selectedEnquiry.course}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500">Qualification</label>
                  <p className="text-base">{selectedEnquiry.qualification || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500">Status</label>
                  <Badge className={getStatusColor(selectedEnquiry.status)}>
                    {selectedEnquiry.status}
                  </Badge>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-slate-500">Message</label>
                  <p className="text-base">{selectedEnquiry.message || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500">Follow Up Date</label>
                  <p className="text-base">{selectedEnquiry.follow_up_date || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500">Assigned To</label>
                  <p className="text-base">{selectedEnquiry.assigned_to || 'N/A'}</p>
                </div>
              </div>
              {selectedEnquiry.admin_notes && (
                <div>
                  <label className="text-sm font-medium text-slate-500">Admin Notes</label>
                  <p className="text-base">{selectedEnquiry.admin_notes}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-slate-500">Created At</label>
                <p className="text-base">{new Date(selectedEnquiry.created_at).toLocaleString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Enquiry?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this enquiry record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
