import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, FolderOpen, BarChart3, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({ users: 0, projects: 0, open: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [profilesRes, projectsRes, openRes] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("projects").select("id", { count: "exact", head: true }).eq("status", "open"),
      ]);
      setStats({
        users: profilesRes.count ?? 0,
        projects: projectsRes.count ?? 0,
        open: openRes.count ?? 0,
      });
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="text-center py-16 text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">System overview and platform statistics.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Users", value: stats.users, icon: Users, color: "text-primary", link: "/admin/users" },
          { label: "Total Projects", value: stats.projects, icon: FolderOpen, color: "text-info", link: "/admin/projects" },
          { label: "Open Projects", value: stats.open, icon: BarChart3, color: "text-success", link: "/admin/projects" },
        ].map((s) => (
          <Link key={s.label} to={s.link} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <p className="font-display text-2xl font-bold text-foreground">{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-display font-semibold text-foreground mb-4">Quick Links</h3>
        <div className="space-y-2">
          <Link to="/admin/users">
            <Button variant="ghost" className="w-full justify-between">Manage Users <ArrowRight className="w-4 h-4" /></Button>
          </Link>
          <Link to="/admin/projects">
            <Button variant="ghost" className="w-full justify-between">View All Projects <ArrowRight className="w-4 h-4" /></Button>
          </Link>
          <Link to="/bulletin">
            <Button variant="ghost" className="w-full justify-between">Bulletin Board <ArrowRight className="w-4 h-4" /></Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
