'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EnquireRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to admin panel - enquiries management is now integrated there
    router.replace('/admin');
  }, [router]);

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <p className="text-muted-foreground">Redirecting to Admin Panel...</p>
    </div>
  );
}
