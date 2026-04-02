export interface Project {
  id: string;
  title: string;
  description: string;
  faculty_id: string;
  faculty_name: string;
  faculty_email: string;
  department: string;
  domain: string;
  skills_required: string[];
  min_cgpa: number | null;
  eligible_years: number[] | null;
  eligible_departments: string[] | null;
  duration: string | null;
  deadline: string | null;
  image_url: string | null;
  attachments: string[] | null;
  status: string;
  created_at: string;
}

export interface Application {
  id: string;
  project_id: string;
  student_id: string;
  status: string;
  statement_of_interest: string | null;
  remarks: string | null;
  applied_at: string;
  updated_at: string;
  project_title?: string;
  project_department?: string;
  faculty_name?: string;
  student_name?: string;
  student_email?: string;
  student_roll?: string;
  student_branch?: string;
  student_year?: number | null;
  student_cgpa?: number | null;
  student_skills?: string[] | null;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  roll_number: string | null;
  branch: string | null;
  year: number | null;
  cgpa: number | null;
  skills: string[] | null;
  linkedin: string | null;
  github: string | null;
  resume_url: string | null;
  bio: string | null;
  past_projects: string[] | null;
  domain: string | null;
  position: string | null;
  expertise_tags: string[] | null;
  contact_info: string | null;
}

export interface BulletinPost {
  id: string;
  title: string;
  content: string;
  type: string;
  created_by: string;
  created_at: string;
  creator_name?: string;
}
