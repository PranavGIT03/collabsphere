import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Github, Linkedin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import type { Profile } from "@/lib/types";

const StudentProfile: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) setProfile(data as Profile);
        setLoading(false);
      });
  }, [user]);

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills?.includes(newSkill.trim())) {
      setProfile({ ...profile, skills: [...(profile.skills ?? []), newSkill.trim()] });
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setProfile({ ...profile, skills: (profile.skills ?? []).filter((s) => s !== skill) });
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profile.full_name,
        roll_number: profile.roll_number,
        branch: profile.branch,
        year: profile.year,
        cgpa: profile.cgpa,
        bio: profile.bio,
        linkedin: profile.linkedin,
        github: profile.github,
        skills: profile.skills,
      })
      .eq("user_id", user.id);
    setSaving(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile Updated", description: "Your profile has been saved successfully." });
    }
  };

  if (loading) return <div className="text-center py-16 text-muted-foreground">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">My Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your personal information and academic details.</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-6">
        <h2 className="font-display font-semibold text-foreground border-b border-border pb-3">Personal Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input value={profile.full_name ?? ""} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Roll Number</Label>
            <Input value={profile.roll_number ?? ""} onChange={(e) => setProfile({ ...profile, roll_number: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Branch / Department</Label>
            <Input value={profile.branch ?? ""} onChange={(e) => setProfile({ ...profile, branch: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Year</Label>
            <Input type="number" min={1} max={5} value={profile.year ?? ""} onChange={(e) => setProfile({ ...profile, year: parseInt(e.target.value) || undefined })} />
          </div>
          <div className="space-y-2">
            <Label>CGPA</Label>
            <Input type="number" step="0.1" min={0} max={10} value={profile.cgpa ?? ""} onChange={(e) => setProfile({ ...profile, cgpa: parseFloat(e.target.value) || undefined })} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Bio</Label>
          <Textarea value={profile.bio ?? ""} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} rows={3} />
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-6">
        <h2 className="font-display font-semibold text-foreground border-b border-border pb-3">Skills</h2>
        <div className="flex flex-wrap gap-2 mb-3">
          {(profile.skills ?? []).map((skill) => (
            <Badge key={skill} variant="secondary" className="gap-1 pr-1">
              {skill}
              <button onClick={() => removeSkill(skill)} className="ml-1 hover:text-destructive">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input placeholder="Add a skill..." value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())} />
          <Button variant="outline" size="icon" onClick={addSkill}><Plus className="w-4 h-4" /></Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-6">
        <h2 className="font-display font-semibold text-foreground border-b border-border pb-3">Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><Linkedin className="w-4 h-4" /> LinkedIn</Label>
            <Input value={profile.linkedin ?? ""} onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })} placeholder="https://linkedin.com/in/..." />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><Github className="w-4 h-4" /> GitHub</Label>
            <Input value={profile.github ?? ""} onChange={(e) => setProfile({ ...profile, github: e.target.value })} placeholder="https://github.com/..." />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => window.history.back()}>Cancel</Button>
        <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
      </div>
    </div>
  );
};

export default StudentProfile;
