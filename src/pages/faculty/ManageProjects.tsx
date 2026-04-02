import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import type { Project } from "@/lib/types";

const ManageProjects: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("faculty_id", user.id)
      .order("created_at", { ascending: false });
    setProjects(
      (data ?? []).map((p: any) => ({
        ...p,
        faculty_name: user.name,
        faculty_email: user.email,
        skills_required: p.skills_required ?? [],
        eligible_years: p.eligible_years ?? [],
        eligible_departments: p.eligible_departments ?? [],
      }))
    );
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Project deleted" });
      setProjects(projects.filter((p) => p.id !== id));
    }
  };

  const handleToggleStatus = async (id: string, current: string) => {
    const next = current === "open" ? "closed" : "open";
    const { error } = await supabase.from("projects").update({ status: next }).eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setProjects(projects.map((p) => p.id === id ? { ...p, status: next } : p));
    }
  };

  if (loading) return <div className="text-center py-16 text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Manage Projects</h1>
        <p className="text-muted-foreground mt-1">Edit, close, or review applicants for your projects.</p>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">No projects yet.</div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium text-foreground">{p.title}</TableCell>
                  <TableCell className="text-muted-foreground">{p.domain}</TableCell>
                  <TableCell className="text-muted-foreground">{p.deadline ?? "—"}</TableCell>
                  <TableCell>
                    <button onClick={() => handleToggleStatus(p.id, p.status)}>
                      <Badge variant={p.status === "open" ? "default" : "secondary"} className="cursor-pointer">{p.status}</Badge>
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link to={`/faculty/projects/${p.id}/applicants`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Users className="w-4 h-4" /></Button>
                      </Link>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(p.id, p.title)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ManageProjects;
