import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PlusCircle, Users, FolderOpen, Clock, ArrowRight } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import type { Project, Application } from "@/lib/types";

const FacultyDashboard: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [recentApps, setRecentApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: projs } = await supabase
        .from("projects")
        .select("*")
        .eq("faculty_id", user.id)
        .order("created_at", { ascending: false });

      const myProjects = (projs ?? []) as any[];
      setProjects(myProjects.map((p) => ({ ...p, faculty_name: user.name, faculty_email: user.email, skills_required: p.skills_required ?? [], eligible_years: p.eligible_years ?? [], eligible_departments: p.eligible_departments ?? [] })));

      if (myProjects.length > 0) {
        const projectIds = myProjects.map((p) => p.id);
        const { data: apps } = await supabase
          .from("applications")
          .select("*, projects(title)")
          .in("project_id", projectIds)
          .order("applied_at", { ascending: false })
          .limit(5);

        const studentIds = (apps ?? []).map((a: any) => a.student_id);
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, full_name")
          .in("user_id", studentIds);
        const profileMap = Object.fromEntries((profiles ?? []).map((p) => [p.user_id, p.full_name]));

        setRecentApps(
          (apps ?? []).map((a: any) => ({
            ...a,
            project_title: a.projects?.title ?? "",
            student_name: profileMap[a.student_id] ?? "Unknown",
          }))
        );
      }
      setLoading(false);
    })();
  }, [user]);

  const openCount = projects.filter((p) => p.status === "open").length;
  const pendingCount = recentApps.filter((a) => a.status === "applied").length;

  if (loading) return <div className="text-center py-16 text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Faculty Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your projects and review applications.</p>
        </div>
        <Link to="/faculty/post-project">
          <Button><PlusCircle className="w-4 h-4 mr-2" /> Post New Project</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Active Projects", value: openCount, icon: FolderOpen, color: "text-primary" },
          { label: "Pending Applications", value: pendingCount, icon: Clock, color: "text-warning" },
          { label: "Total Applicants", value: recentApps.length, icon: Users, color: "text-info" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <p className="font-display text-2xl font-bold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold text-foreground">My Projects</h2>
          <Link to="/faculty/manage-projects" className="flex items-center gap-1 text-sm text-primary font-medium hover:underline">
            Manage All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {projects.length === 0 ? (
          <p className="text-sm text-muted-foreground">No projects yet. Post your first project!</p>
        ) : (
          <div className="bg-card border border-border rounded-xl divide-y divide-border">
            {projects.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-foreground">{p.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{p.department} · {p.duration} · Deadline: {p.deadline}</p>
                </div>
                <StatusBadge status={p.status === "open" ? "applied" : "rejected"} />
              </div>
            ))}
          </div>
        )}
      </div>

      {recentApps.length > 0 && (
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">Recent Applicants</h2>
          <div className="bg-card border border-border rounded-xl divide-y divide-border">
            {recentApps.map((a) => (
              <div key={a.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-foreground">{a.student_name}</p>
                  <p className="text-xs text-muted-foreground">{a.project_title}</p>
                </div>
                <StatusBadge status={a.status as any} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;
