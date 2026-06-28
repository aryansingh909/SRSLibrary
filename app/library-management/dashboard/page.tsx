'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, GraduationCap, Mail, Clock, Loader2 } from 'lucide-react';

interface Stats {
  totalMemberships: number;
  activeMemberships: number;
  pendingMemberships: number;
  totalEnquiries: number;
  newEnquiries: number;
  totalContacts: number;
  unreadContacts: number;
}

interface RecentActivity {
  type: 'membership' | 'enquiry' | 'contact';
  data: Record<string, unknown>;
  created_at: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/portal/data?type=stats');
        const data = await res.json();
        setStats(data.stats);

        const recentRes = await fetch('/api/portal/data?type=recent');
        const recentData = await recentRes.json();
        setRecent(recentData.recent || []);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Library Memberships</CardTitle>
            <Users className="w-8 h-8 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats?.totalMemberships || 0}</div>
            <div className="mt-2 flex gap-2">
              <Badge variant="secondary" className="text-sm">
                {stats?.activeMemberships || 0} Active
              </Badge>
              <Badge variant="outline" className="text-sm">
                {stats?.pendingMemberships || 0} Pending
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Degree Enquiries</CardTitle>
            <GraduationCap className="w-8 h-8 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats?.totalEnquiries || 0}</div>
            <div className="mt-2">
              <Badge variant="destructive" className="text-sm">
                {stats?.newEnquiries || 0} New
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Contact Messages</CardTitle>
            <Mail className="w-8 h-8 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats?.totalContacts || 0}</div>
            <div className="mt-2">
              <Badge variant="destructive" className="text-sm">
                {stats?.unreadContacts || 0} Unread
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No recent activity</p>
          ) : (
            <div className="space-y-4">
              {recent.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800"
                >
                  <div className={`p-3 rounded-full ${
                    activity.type === 'membership' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'enquiry' ? 'bg-emerald-100 text-emerald-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    {activity.type === 'membership' ? <Users className="w-5 h-5" /> :
                     activity.type === 'enquiry' ? <GraduationCap className="w-5 h-5" /> :
                     <Mail className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="capitalize">
                        {activity.type}
                      </Badge>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {activity.data.name as string}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {activity.type === 'membership' && `Plan: ${activity.data.plan}`}
                      {activity.type === 'enquiry' && `Course: ${activity.data.course}`}
                      {activity.type === 'contact' && `Subject: ${activity.data.subject || 'N/A'}`}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(activity.created_at).toLocaleString()}
                    </p>
                  </div>
                  <Badge className={`${
                    activity.data.status === 'new' || activity.data.status === 'active' ? 'bg-blue-600' :
                    activity.data.status === 'pending' ? 'bg-amber-600' :
                    'bg-slate-600'
                  }`}>
                    {activity.data.status as string}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
