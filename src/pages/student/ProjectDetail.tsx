import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ArrowLeft, Calendar, Clock, User, Mail, GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { fetchProjectsWithFaculty } from "@/lib/supabase-helpers";
import { useAuth } from "@/lib/auth-context";
import type { Project } from "@/lib/types";

const ProjectDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApply, setShowApply] = useState(false);
  const [soi, setSoi] = useState("");
  const [eligConfirm, setEligConfirm] = useState(false);
  const [applying, setApplying] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const projects = await fetchProjectsWithFaculty((q) => q.eq("id", id));
      setProject(projects[0] ?? null);

      if (user) {
        const { data } = await supabase
          .from("applications")
          .select("id")
          .eq("project_id", id)
          .eq("student_id", user.id)
          .maybeSingle();
        setAlreadyApplied(!!data);
      }
      setLoading(false);
    })();
  }, [id, user]);

  const handleApply = async () => {
    if (!user || !project) return;
    setApplying(true);
    const { error } = await supabase.from("applications").insert({
      project_id: project.id,
      student_id: user.id,
      statement_of_interest: soi,
      status: "applied",
    });
    setApplying(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Application Submitted!", description: `You've applied to "${project.title}".` });
    setAlreadyApplied(true);
    setShowApply(false);
    setSoi("");
    setEligConfirm(false);
  };

  if (loading) return <div className="text-center py-16 text-muted-foreground">Loading...</div>;
  if (!project) return <div className="text-center py-16 text-muted-foreground">Project not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Projects
      </button>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="h-2 bg-primary" />
        <div className="p-6 lg:p-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">{project.title}</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><User className="w-4 h-4" />{project.faculty_name}</span>
                <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" />{project.faculty_email}</span>
              </div>
            </div>
            <Badge variant={project.status === "open" ? "default" : "secondary"} className="text-sm">{project.status}</Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-xs text-muted-foreground">Department</p>
              <p className="text-sm font-medium text-foreground">{project.department}</p>
            </div>
            {project.duration && (
              <div>
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="text-sm font-medium text-foreground flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{project.duration}</p>
              </div>
            )}
            {project.deadline && (
              <div>
                <p className="text-xs text-muted-foreground">Deadline</p>
                <p className="text-sm font-medium text-foreground flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{project.deadline}</p>
              </div>
            )}
            {project.min_cgpa != null && (
              <div>
                <p className="text-xs text-muted-foreground">Min. CGPA</p>
                <p className="text-sm font-medium text-foreground flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" />{project.min_cgpa}</p>
              </div>
            )}
          </div>

          <div className="mt-6">
            <h2 className="font-display font-semibold text-foreground mb-2">Description</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p>
          </div>

          {project.skills_required.length > 0 && (
            <div className="mt-6">
              <h2 className="font-display font-semibold text-foreground mb-3">Skills Required</h2>
              <div className="flex flex-wrap gap-2">
                {project.skills_required.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
              </div>
            </div>
          )}

          {((project.eligible_years?.length ?? 0) > 0 || (project.eligible_departments?.length ?? 0) > 0) && (
            <div className="mt-6">
              <h2 className="font-display font-semibold text-foreground mb-2">Eligibility</h2>
              <div className="text-sm text-muted-foreground space-y-1">
                {(project.eligible_years?.length ?? 0) > 0 && <p>Eligible Years: {project.eligible_years!.join(", ")}</p>}
                {(project.eligible_departments?.length ?? 0) > 0 && <p>Eligible Departments: {project.eligible_departments!.join(", ")}</p>}
              </div>
            </div>
          )}

          {user?.role === "student" && project.status === "open" && (
            <div className="mt-8 pt-6 border-t border-border">
              {alreadyApplied ? (
                <p className="text-sm text-muted-foreground">You have already applied to this project.</p>
              ) : (
                <Button size="lg" onClick={() => setShowApply(true)}>Apply Now</Button>
              )}
            </div>
          )}
        </div>
      </div>

      <Dialog open={showApply} onOpenChange={setShowApply}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Apply to Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Statement of Interest</Label>
              <Textarea rows={4} placeholder="Why are you interested in this project?" value={soi} onChange={(e) => setSoi(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="elig" checked={eligConfirm} onCheckedChange={(c) => setEligConfirm(c === true)} />
              <Label htmlFor="elig" className="text-sm font-normal">I confirm that I meet the eligibility criteria</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApply(false)}>Cancel</Button>
            <Button onClick={handleApply} disabled={!soi.trim() || !eligConfirm || applying}>
              {applying ? "Submitting..." : "Submit Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectDetail;
