import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "@/components/StatusBadge";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fetchApplicationsForProject } from "@/lib/supabase-helpers";
import type { Application } from "@/lib/types";

const ApplicantReview: React.FC = () => {
  const { id: projectId } = useParams();
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [projectTitle, setProjectTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;
    (async () => {
      const [apps, proj] = await Promise.all([
        fetchApplicationsForProject(projectId),
        supabase.from("projects").select("title").eq("id", projectId).single(),
      ]);
      setApplications(apps);
      setProjectTitle(proj.data?.title ?? "");
      setLoading(false);
    })();
  }, [projectId]);

  const updateStatus = async (appId: string, status: string, studentName: string) => {
    const { error } = await supabase
      .from("applications")
      .update({ status })
      .eq("id", appId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: `${studentName} has been ${status}.` });
      setApplications(applications.map((a) => a.id === appId ? { ...a, status } : a));
    }
  };

  if (loading) return <div className="text-center py-16 text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Review Applicants</h1>
        <p className="text-muted-foreground mt-1">{projectTitle}</p>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">No applications yet.</div>
      ) : (
        <div className="space-y-4">
          {applications.map((a) => (
            <div key={a.id} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                      {(a.student_name ?? "?").charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{a.student_name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {[a.student_roll, a.student_branch, a.student_year ? `Year ${a.student_year}` : null].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 p-3 bg-muted/50 rounded-lg text-sm">
                    {a.student_cgpa != null && (
                      <div><span className="text-muted-foreground text-xs">CGPA</span><p className="font-semibold text-foreground">{a.student_cgpa}</p></div>
                    )}
                    <div><span className="text-muted-foreground text-xs">Applied</span><p className="font-medium text-foreground">{new Date(a.applied_at).toLocaleDateString()}</p></div>
                    <div><span className="text-muted-foreground text-xs">Status</span><div className="mt-0.5"><StatusBadge status={a.status as any} /></div></div>
                  </div>

                  {(a.student_skills?.length ?? 0) > 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground mb-1">Skills</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(a.student_skills ?? []).map((s) => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
                      </div>
                    </div>
                  )}

                  {a.statement_of_interest && (
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground mb-1">Statement of Interest</p>
                      <p className="text-sm text-foreground">{a.statement_of_interest}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                <Button size="sm" variant="outline" onClick={() => updateStatus(a.id, "shortlisted", a.student_name ?? "")}>
                  <Star className="w-3.5 h-3.5 mr-1" /> Shortlist
                </Button>
                <Button size="sm" onClick={() => updateStatus(a.id, "selected", a.student_name ?? "")}>
                  <CheckCircle className="w-3.5 h-3.5 mr-1" /> Select
                </Button>
                <Button size="sm" variant="outline" className="text-destructive" onClick={() => updateStatus(a.id, "rejected", a.student_name ?? "")}>
                  <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicantReview;
