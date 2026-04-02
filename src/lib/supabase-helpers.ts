import { supabase } from "@/integrations/supabase/client";
import type { Project, Application, BulletinPost } from "./types";

export async function fetchProjectsWithFaculty(
  filter?: (q: ReturnType<typeof supabase.from<"projects">>) => any
): Promise<Project[]> {
  let query = supabase.from("projects").select("*").order("created_at", { ascending: false });
  if (filter) query = filter(query as any);
  const { data: projects, error } = await (query as any);
  if (error || !projects?.length) return [];

  const facultyIds = [...new Set((projects as any[]).map((p) => p.faculty_id))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("user_id, full_name, email")
    .in("user_id", facultyIds);

  const profileMap = Object.fromEntries(
    (profiles || []).map((p) => [p.user_id, p])
  );

  return (projects as any[]).map((p) => ({
    ...p,
    skills_required: p.skills_required ?? [],
    eligible_years: p.eligible_years ?? [],
    eligible_departments: p.eligible_departments ?? [],
    faculty_name: profileMap[p.faculty_id]?.full_name ?? "Unknown Faculty",
    faculty_email: profileMap[p.faculty_id]?.email ?? "",
  })) as Project[];
}

export async function fetchApplicationsForStudent(studentId: string): Promise<Application[]> {
  const { data: apps, error } = await supabase
    .from("applications")
    .select("*, projects(title, faculty_id, department)")
    .eq("student_id", studentId)
    .order("applied_at", { ascending: false });

  if (error || !apps?.length) return [];

  const facultyIds = [...new Set((apps as any[]).map((a) => (a.projects as any)?.faculty_id).filter(Boolean))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("user_id, full_name")
    .in("user_id", facultyIds);

  const profileMap = Object.fromEntries((profiles || []).map((p) => [p.user_id, p.full_name]));

  return (apps as any[]).map((a) => ({
    id: a.id,
    project_id: a.project_id,
    student_id: a.student_id,
    status: a.status,
    statement_of_interest: a.statement_of_interest,
    remarks: a.remarks,
    applied_at: a.applied_at,
    updated_at: a.updated_at,
    project_title: a.projects?.title ?? "Unknown Project",
    project_department: a.projects?.department ?? "",
    faculty_name: profileMap[a.projects?.faculty_id] ?? "Unknown Faculty",
  })) as Application[];
}

export async function fetchApplicationsForProject(projectId: string): Promise<Application[]> {
  const { data: apps, error } = await supabase
    .from("applications")
    .select("*")
    .eq("project_id", projectId)
    .order("applied_at", { ascending: false });

  if (error || !apps?.length) return [];

  const studentIds = (apps as any[]).map((a) => a.student_id);
  const { data: profiles } = await supabase
    .from("profiles")
    .select("user_id, full_name, email, roll_number, branch, year, cgpa, skills")
    .in("user_id", studentIds);

  const profileMap = Object.fromEntries((profiles || []).map((p) => [p.user_id, p]));

  return (apps as any[]).map((a) => {
    const prof = profileMap[a.student_id];
    return {
      ...a,
      student_name: prof?.full_name ?? "Unknown",
      student_email: prof?.email ?? "",
      student_roll: prof?.roll_number ?? "",
      student_branch: prof?.branch ?? "",
      student_year: prof?.year ?? null,
      student_cgpa: prof?.cgpa ?? null,
      student_skills: prof?.skills ?? [],
    };
  }) as Application[];
}

export async function fetchBulletinPosts(): Promise<BulletinPost[]> {
  const { data: posts, error } = await supabase
    .from("bulletin_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !posts?.length) return [];

  const creatorIds = [...new Set((posts as any[]).map((p) => p.created_by))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("user_id, full_name")
    .in("user_id", creatorIds);

  const profileMap = Object.fromEntries((profiles || []).map((p) => [p.user_id, p.full_name]));

  return (posts as any[]).map((p) => ({
    ...p,
    creator_name: profileMap[p.created_by] ?? "Unknown",
  })) as BulletinPost[];
}
