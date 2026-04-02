import React, { useEffect, useState } from "react";
import StatusBadge from "@/components/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fetchApplicationsForStudent } from "@/lib/supabase-helpers";
import { useAuth } from "@/lib/auth-context";
import type { Application } from "@/lib/types";

const ApplicationTracking: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchApplicationsForStudent(user.id).then((data) => {
      setApplications(data);
      setLoading(false);
    });
  }, [user]);

  if (loading) return <div className="text-center py-16 text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">My Applications</h1>
        <p className="text-muted-foreground mt-1">Track the status of your project applications.</p>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">You haven't applied to any projects yet.</div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Faculty</TableHead>
                <TableHead>Applied On</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Feedback</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium text-foreground">{app.project_title}</TableCell>
                  <TableCell className="text-muted-foreground">{app.faculty_name}</TableCell>
                  <TableCell className="text-muted-foreground">{new Date(app.applied_at).toLocaleDateString()}</TableCell>
                  <TableCell><StatusBadge status={app.status as any} /></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{app.remarks || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ApplicationTracking;
