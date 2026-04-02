import React, { useState, useMemo, useEffect } from "react";
import ProjectCard from "@/components/ProjectCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { fetchProjectsWithFaculty } from "@/lib/supabase-helpers";
import type { Project } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";

interface ProjectListingProps {
  linkPrefix?: string;
}

const ProjectListing: React.FC<ProjectListingProps> = ({ linkPrefix }) => {
  const { user } = useAuth();
  const resolvedPrefix = linkPrefix ?? (user?.role === "admin" ? "/admin" : "/student");

  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [domainFilter, setDomainFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [professorFilter, setProfessorFilter] = useState("all");

  useEffect(() => {
    fetchProjectsWithFaculty().then((data) => {
      setAllProjects(data);
      setLoading(false);
    });
  }, []);

  const departments = [...new Set(allProjects.map((p) => p.department))];
  const domains = [...new Set(allProjects.map((p) => p.domain))];
  const professors = [...new Set(allProjects.map((p) => p.faculty_name))];

  const filtered = useMemo(() => {
    return allProjects.filter((p) => {
      const matchSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchDept = departmentFilter === "all" || p.department === departmentFilter;
      const matchDomain = domainFilter === "all" || p.domain === domainFilter;
      const matchStatus = statusFilter === "all" || p.status === statusFilter;
      const matchProfessor = professorFilter === "all" || p.faculty_name === professorFilter;
      return matchSearch && matchDept && matchDomain && matchStatus && matchProfessor;
    });
  }, [allProjects, search, departmentFilter, domainFilter, statusFilter, professorFilter]);

  if (loading) return <div className="text-center py-16 text-muted-foreground">Loading projects...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Browse Projects</h1>
        <p className="text-muted-foreground mt-1">Discover academic projects that match your skills and interests.</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
          <Filter className="w-4 h-4" /> Filters
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger><SelectValue placeholder="Department" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={domainFilter} onValueChange={setDomainFilter}>
            <SelectTrigger><SelectValue placeholder="Domain" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Domains</SelectItem>
              {domains.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={professorFilter} onValueChange={setProfessorFilter}>
            <SelectTrigger><SelectValue placeholder="Professor" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Professors</SelectItem>
              {professors.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">{filtered.length} project{filtered.length !== 1 ? "s" : ""} found</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => <ProjectCard key={p.id} project={p} linkPrefix={resolvedPrefix} />)}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No projects match your filters.</p>
        </div>
      )}
    </div>
  );
};

export default ProjectListing;
