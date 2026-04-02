import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Calendar, Megaphone, AlertCircle, FileText, Plus } from "lucide-react";
import { fetchBulletinPosts } from "@/lib/supabase-helpers";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import type { BulletinPost } from "@/lib/types";

const typeConfig: Record<string, { icon: React.ElementType; color: string }> = {
  announcement: { icon: Megaphone, color: "text-primary" },
  deadline: { icon: AlertCircle, color: "text-warning" },
  notice: { icon: FileText, color: "text-info" },
  general: { icon: Bell, color: "text-muted-foreground" },
};

const BulletinBoard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<BulletinPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newType, setNewType] = useState("general");
  const [posting, setPosting] = useState(false);

  const load = async () => {
    const data = await fetchBulletinPosts();
    setPosts(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handlePost = async () => {
    if (!user || !newTitle.trim() || !newContent.trim()) return;
    setPosting(true);
    const { error } = await supabase.from("bulletin_posts").insert({
      title: newTitle.trim(),
      content: newContent.trim(),
      type: newType,
      created_by: user.id,
    });
    setPosting(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Post published!" });
      setNewTitle("");
      setNewContent("");
      setNewType("general");
      setShowForm(false);
      load();
    }
  };

  if (loading) return <div className="text-center py-16 text-muted-foreground">Loading...</div>;

  const canPost = user?.role === "faculty" || user?.role === "admin";

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Bulletin Board</h1>
          <p className="text-muted-foreground mt-1">Announcements, notices, and deadlines.</p>
        </div>
        {canPost && (
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" /> New Post
          </Button>
        )}
      </div>

      {showForm && canPost && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="font-display font-semibold text-foreground">Create Post</h3>
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Post title..." />
          </div>
          <div className="space-y-2">
            <Label>Content</Label>
            <Textarea value={newContent} onChange={(e) => setNewContent(e.target.value)} rows={3} placeholder="Post content..." />
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={newType} onValueChange={setNewType}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="announcement">Announcement</SelectItem>
                <SelectItem value="deadline">Deadline</SelectItem>
                <SelectItem value="notice">Notice</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button onClick={handlePost} disabled={posting || !newTitle.trim() || !newContent.trim()}>
              {posting ? "Publishing..." : "Publish"}
            </Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">No posts yet.</div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => {
            const config = typeConfig[post.type] ?? typeConfig.general;
            const Icon = config.icon;
            return (
              <div key={post.id} className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0 ${config.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-display font-semibold text-foreground">{post.title}</h3>
                      <Badge variant="secondary" className="capitalize text-xs">{post.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{post.content}</p>
                    <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                      <span>{post.creator_name}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BulletinBoard;
