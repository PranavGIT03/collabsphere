import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Save, Plus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import type { Profile } from "@/lib/types";

const FacultyProfile: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [newExpertise, setNewExpertise] = useState("");
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

  const addExpertise = () => {
    if (newExpertise.trim() && !(profile.expertise_tags ?? []).includes(newExpertise.trim())) {
      setProfile({ ...profile, expertise_tags: [...(profile.expertise_tags ?? []), newExpertise.trim()] });
      setNewExpertise("");
    }
  };

  const removeExpertise = (tag: string) => {
    setProfile({ ...profile, expertise_tags: (profile.expertise_tags ?? []).filter((t) => t !== tag) });
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profile.full_name,
        domain: profile.domain,
        position: profile.position,
        bio: profile.bio,
        linkedin: profile.linkedin,
        contact_info: profile.contact_info,
        expertise_tags: profile.expertise_tags,
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
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">My Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your faculty profile information.</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input value={profile.full_name ?? ""} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={profile.email ?? ""} readOnly className="bg-muted" />
          </div>
          <div className="space-y-2">
            <Label>Department / Domain</Label>
            <Input value={profile.domain ?? ""} onChange={(e) => setProfile({ ...profile, domain: e.target.value })} placeholder="e.g., Computer Science" />
          </div>
          <div className="space-y-2">
            <Label>Position</Label>
            <Input value={profile.position ?? ""} onChange={(e) => setProfile({ ...profile, position: e.target.value })} placeholder="e.g., Associate Professor" />
          </div>
          <div className="space-y-2">
            <Label>LinkedIn</Label>
            <Input value={profile.linkedin ?? ""} onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })} placeholder="https://linkedin.com/in/..." />
          </div>
          <div className="space-y-2">
            <Label>Contact Info</Label>
            <Input value={profile.contact_info ?? ""} onChange={(e) => setProfile({ ...profile, contact_info: e.target.value })} placeholder="Office / phone" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Bio</Label>
          <Textarea rows={4} value={profile.bio ?? ""} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} />
        </div>

        <div className="space-y-2">
          <Label>Areas of Expertise</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {(profile.expertise_tags ?? []).map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1">
                {tag}
                <button onClick={() => removeExpertise(tag)} className="ml-1 hover:text-destructive"><X className="w-3 h-3" /></button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input placeholder="Add expertise..." value={newExpertise} onChange={(e) => setNewExpertise(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addExpertise())} />
            <Button type="button" variant="outline" size="icon" onClick={addExpertise}><Plus className="w-4 h-4" /></Button>
          </div>
        </div>

        <Button onClick={handleSave} disabled={saving} className="gap-2">
          <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </div>
  );
};

export default FacultyProfile;
