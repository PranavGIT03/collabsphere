import React, { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ProjectCard from "@/components/ProjectCard";
import StatusBadge from "@/components/StatusBadge";
import { ArrowRight, Bell, FileText, FolderOpen, User } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { fetchProjectsWithFaculty, fetchApplicationsForStudent, fetchBulletinPosts } from "@/lib/supabase-helpers";
import type { Project, Application, BulletinPost, Profile } from "@/lib/types";

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [notices, setNotices] = useState<BulletinPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [prof, projs, apps, posts] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).single(),
        fetchProjectsWithFaculty((q) => q.eq("status", "open")),
        fetchApplicationsForStudent(user.id),
        fetchBulletinPosts(),
      ]);
      setProfile(prof.data as Profile | null);
      setProjects(projs);
      setApplications(apps);
      setNotices(posts.slice(0, 2));
      setLoading(false);
    })();
  }, [user]);

  const profileCompletion = profile
    ? Math.round(
        [
          profile.full_name,
          profile.email,
          profile.roll_number,
          profile.branch,
          profile.year,
          profile.cgpa,
          profile.bio,
          profile.linkedin,
          profile.github,
          profile.resume_url,
        ].filter(Boolean).length * 10
      )
    : 0;

  if (loading) return <div className="text-center py-16 text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Welcome back, {profile?.full_name?.split(" ")[0] ?? user?.name?.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground mt-1">Here's what's happening with your projects.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Profile Completion", value: `${profileCompletion}%`, icon: User, color: "text-primary" },
          { label: "Open Projects", value: projects.length.toString(), icon: FolderOpen, color: "text-info" },
          { label: "My Applications", value: applications.length.toString(), icon: FileText, color: "text-warning" },
          { label: "Notices", value: notices.length.toString(), icon: Bell, color: "text-success" },
        ].map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold text-foreground">Profile Completion</h3>
          <Link to="/student/profile">
            <Button variant="outline" size="sm">Complete Profile</Button>
          </Link>
        </div>
        <Progress value={profileCompletion} className="h-2" />
        <p className="text-xs text-muted-foreground mt-2">{profileCompletion}% complete</p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold text-foreground">Open Projects</h2>
          <Link to="/student/projects" className="flex items-center gap-1 text-sm text-primary font-medium hover:underline">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {projects.length === 0 ? (
          <p className="text-muted-foreground text-sm">No open projects yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.slice(0, 3).map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-display font-semibold text-foreground mb-4">Application Status</h3>
          {applications.length === 0 ? (
            <p className="text-sm text-muted-foreground">No applications yet.</p>
          ) : (
            <div className="space-y-3">
              {applications.slice(0, 3).map((app) => (
                <div key={app.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{app.project_title}</p>
                    <p className="text-xs text-muted-foreground">{app.faculty_name}</p>
                  </div>
                  <StatusBadge status={app.status as any} />
                </div>
              ))}
            </div>
          )}
          <Link to="/student/applications">
            <Button variant="ghost" size="sm" className="w-full mt-3 text-primary">View All Applications</Button>
          </Link>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-display font-semibold text-foreground mb-4">Latest Notices</h3>
          {notices.length === 0 ? (
            <p className="text-sm text-muted-foreground">No notices yet.</p>
          ) : (
            <div className="space-y-3">
              {notices.map((n) => (
                <div key={n.id} className="py-2 border-b border-border last:border-0">
                  <p className="text-sm font-medium text-foreground">{n.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{n.content}</p>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(n.created_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
          <Link to="/bulletin">
            <Button variant="ghost" size="sm" className="w-full mt-3 text-primary">View Bulletin Board</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
