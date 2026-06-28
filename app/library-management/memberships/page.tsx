'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  DialogFooter,
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
import { Search, Eye, Trash2, Loader2, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { toast } from 'sonner';

interface Membership {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: string;
  status: string;
  payment_status: string;
  amount: number | null;
  start_date: string | null;
  end_date: string | null;
  seat_number: number | null;
  admin_notes: string | null;
  created_at: string;
}

const ITEMS_PER_PAGE = 10;

export default function MembershipsPage() {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedMember, setSelectedMember] = useState<Membership | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchMemberships = useCallback(async () => {
    try {
      const res = await fetch('/api/portal/data?type=memberships');
      const data = await res.json();
      setMemberships(data.memberships || []);
    } catch (err) {
      console.error('Failed to fetch memberships:', err);
      toast.error('Failed to load memberships');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMemberships();
  }, [fetchMemberships]);

  const filteredMemberships = memberships.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.phone.includes(search);
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    const matchesPlan = planFilter === 'all' || m.plan === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const totalPages = Math.ceil(filteredMemberships.length / ITEMS_PER_PAGE);
  const paginatedMemberships = filteredMemberships.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdating(id);
    try {
      const res = await fetch('/api/portal/data', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'membership', id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setMemberships(memberships.map(m => m.id === id ? { ...m, status: newStatus } : m));
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
      const res = await fetch(`/api/portal/data?type=membership&id=${deleteId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setMemberships(memberships.filter(m => m.id !== deleteId));
        toast.success('Membership deleted');
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
      case 'active': return 'bg-emerald-600';
      case 'pending': return 'bg-amber-600';
      case 'expired': return 'bg-slate-600';
      case 'cancelled': return 'bg-red-600';
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
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Library Memberships</h1>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          <Users className="w-4 h-4 mr-2" />
          {filteredMemberships.length} Records
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={planFilter} onValueChange={(v) => { setPlanFilter(v); setPage(1); }}>
              <SelectTrigger className="w-full md:w-40 h-12">
                <SelectValue placeholder="Plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
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
                  <th className="px-4 py-3 text-left text-sm font-semibold">Plan</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold hidden lg:table-cell">Date</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {paginatedMemberships.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-500">
                      No memberships found
                    </td>
                  </tr>
                ) : (
                  paginatedMemberships.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="px-4 py-4">
                        <div className="font-medium">{m.name}</div>
                        <div className="text-sm text-slate-500">{m.email}</div>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">{m.phone}</td>
                      <td className="px-4 py-4">
                        <Badge variant="outline" className="capitalize">{m.plan}</Badge>
                      </td>
                      <td className="px-4 py-4">
                        <Select
                          value={m.status}
                          onValueChange={(v) => handleStatusChange(m.id, v)}
                          disabled={updating === m.id}
                        >
                          <SelectTrigger className={`w-32 h-9 ${getStatusColor(m.status)} text-white border-0`}>
                            {updating === m.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <SelectValue />
                            )}
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="expired">Expired</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-4 text-sm hidden lg:table-cell">
                        {new Date(m.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedMember(m)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setDeleteId(m.id)}
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
                Showing {(page - 1) * ITEMS_PER_PAGE + 1} to {Math.min(page * ITEMS_PER_PAGE, filteredMemberships.length)} of {filteredMemberships.length}
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
      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Membership Details</DialogTitle>
            <DialogDescription>Full information about this membership</DialogDescription>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-500">Name</label>
                  <p className="text-base">{selectedMember.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500">Phone</label>
                  <p className="text-base">{selectedMember.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500">Email</label>
                  <p className="text-base">{selectedMember.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500">Plan</label>
                  <p className="text-base capitalize">{selectedMember.plan}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500">Status</label>
                  <Badge className={getStatusColor(selectedMember.status)}>
                    {selectedMember.status}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500">Payment Status</label>
                  <Badge variant={selectedMember.payment_status === 'paid' ? 'default' : 'secondary'}>
                    {selectedMember.payment_status}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500">Amount</label>
                  <p className="text-base">₹{selectedMember.amount || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500">Seat Number</label>
                  <p className="text-base">{selectedMember.seat_number || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500">Start Date</label>
                  <p className="text-base">{selectedMember.start_date || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500">End Date</label>
                  <p className="text-base">{selectedMember.end_date || 'N/A'}</p>
                </div>
              </div>
              {selectedMember.admin_notes && (
                <div>
                  <label className="text-sm font-medium text-slate-500">Admin Notes</label>
                  <p className="text-base">{selectedMember.admin_notes}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-slate-500">Created At</label>
                <p className="text-base">{new Date(selectedMember.created_at).toLocaleString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Membership?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this membership record.
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
