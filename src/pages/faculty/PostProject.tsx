import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { useNavigate } from "react-router-dom";

const PostProject: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("");
  const [domain, setDomain] = useState("");
  const [duration, setDuration] = useState("");
  const [deadline, setDeadline] = useState("");
  const [minCgpa, setMinCgpa] = useState("");
  const [eligibleYears, setEligibleYears] = useState("");
  const [eligibleDepts, setEligibleDepts] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);

    const years = eligibleYears
      .split(",")
      .map((y) => parseInt(y.trim()))
      .filter((y) => !isNaN(y));
    const depts = eligibleDepts
      .split(",")
      .map((d) => d.trim())
      .filter(Boolean);

    const { error } = await supabase.from("projects").insert({
      title,
      description,
      department,
      domain,
      duration,
      deadline: deadline || null,
      min_cgpa: minCgpa ? parseFloat(minCgpa) : null,
      eligible_years: years,
      eligible_departments: depts,
      skills_required: skills,
      faculty_id: user.id,
      status: "open",
    });

    setSubmitting(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Project Posted!", description: "Your project has been published successfully." });
      navigate("/faculty/manage-projects");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Post New Project</h1>
        <p className="text-muted-foreground mt-1">Create a new project for students to apply.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card border border-border rounded-xl p-6 space-y-5">
          <h2 className="font-display font-semibold text-foreground border-b border-border pb-3">Project Details</h2>
          <div className="space-y-2">
            <Label>Project Title *</Label>
            <Input placeholder="Enter project title" required value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Description *</Label>
            <Textarea rows={5} placeholder="Detailed project description..." required value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label>Duration</Label>
              <Input placeholder="e.g., 4 months" value={duration} onChange={(e) => setDuration(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Application Deadline</Label>
              <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-5">
          <h2 className="font-display font-semibold text-foreground border-b border-border pb-3">Eligibility</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label>Department *</Label>
              <Input placeholder="e.g., Computer Science" required value={department} onChange={(e) => setDepartment(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Domain *</Label>
              <Input placeholder="e.g., AI, Web, IoT" required value={domain} onChange={(e) => setDomain(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Minimum CGPA</Label>
              <Input type="number" step="0.1" min={0} max={10} placeholder="e.g., 8.0" value={minCgpa} onChange={(e) => setMinCgpa(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Eligible Years</Label>
              <Input placeholder="e.g., 3, 4" value={eligibleYears} onChange={(e) => setEligibleYears(e.target.value)} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Eligible Departments</Label>
              <Input placeholder="e.g., Computer Science, Data Science" value={eligibleDepts} onChange={(e) => setEligibleDepts(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-5">
          <h2 className="font-display font-semibold text-foreground border-b border-border pb-3">Skills Required</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {skills.map((s) => (
              <Badge key={s} variant="secondary" className="gap-1 pr-1">
                {s}
                <button type="button" onClick={() => setSkills(skills.filter((sk) => sk !== s))} className="hover:text-destructive">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input placeholder="Add a skill..." value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())} />
            <Button type="button" variant="outline" size="icon" onClick={addSkill}><Plus className="w-4 h-4" /></Button>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" type="button" onClick={() => navigate(-1)}>Cancel</Button>
          <Button type="submit" disabled={submitting}>{submitting ? "Publishing..." : "Publish Project"}</Button>
        </div>
      </form>
    </div>
  );
};

export default PostProject;
