export type UserRole = "student" | "faculty" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  avatar?: string;
}

export interface StudentProfile {
  userId: string;
  name: string;
  rollNumber: string;
  department: string;
  year: number;
  cgpa: number;
  skills: string[];
  linkedin?: string;
  github?: string;
  resumeUrl?: string;
  bio?: string;
  pastProjects?: string[];
  profileCompletion: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  facultyId: string;
  facultyName: string;
  facultyEmail: string;
  department: string;
  domain: string;
  skillsRequired: string[];
  minCgpa: number;
  eligibleYears: number[];
  eligibleDepartments: string[];
  duration: string;
  deadline: string;
  imageUrl?: string;
  attachments?: string[];
  status: "open" | "closed" | "archived";
  createdAt: string;
}

export interface Application {
  id: string;
  projectId: string;
  projectTitle: string;
  studentId: string;
  studentName: string;
  facultyName: string;
  status: "applied" | "shortlisted" | "selected" | "rejected";
  appliedAt: string;
  statementOfInterest?: string;
  remarks?: string;
}

export interface BulletinPost {
  id: string;
  title: string;
  content: string;
  type: "announcement" | "deadline" | "notice" | "general";
  createdBy: string;
  createdAt: string;
}

export const mockStudentProfile: StudentProfile = {
  userId: "s1",
  name: "Arjun Mehta",
  rollNumber: "SE23UCSE045",
  department: "Computer Science",
  year: 3,
  cgpa: 8.7,
  skills: ["Python", "React", "Machine Learning", "TensorFlow", "SQL"],
  linkedin: "https://linkedin.com/in/arjunmehta",
  github: "https://github.com/arjunmehta",
  resumeUrl: "/resume.pdf",
  bio: "Passionate about AI/ML and full-stack development. Looking for research opportunities in NLP and computer vision.",
  pastProjects: ["Sentiment Analysis Dashboard", "Campus Navigation App"],
  profileCompletion: 85,
};

export const mockProjects: Project[] = [
  {
    id: "p1",
    title: "AI-Powered Student Performance Predictor",
    description: "Build a machine learning model that predicts student academic performance based on engagement metrics, attendance, and past grades. The project involves data collection, feature engineering, model training, and deployment as a web dashboard.",
    facultyId: "f1",
    facultyName: "Dr. Priya Sharma",
    facultyEmail: "priya.sharma@mu.edu",
    department: "Computer Science",
    domain: "AI",
    skillsRequired: ["Python", "Machine Learning", "TensorFlow", "SQL"],
    minCgpa: 8.0,
    eligibleYears: [3, 4],
    eligibleDepartments: ["Computer Science", "Data Science"],
    duration: "4 months",
    deadline: "2026-04-15",
    status: "open",
    createdAt: "2026-02-20",
  },
  {
    id: "p2",
    title: "Campus IoT Monitoring System",
    description: "Design and implement an IoT-based system to monitor environmental conditions across campus. Includes sensor deployment, data pipeline creation, and real-time dashboard development.",
    facultyId: "f2",
    facultyName: "Prof. Rajesh Kumar",
    facultyEmail: "rajesh.kumar@mu.edu",
    department: "Electronics",
    domain: "IoT",
    skillsRequired: ["Arduino", "Python", "MQTT", "React"],
    minCgpa: 7.5,
    eligibleYears: [2, 3, 4],
    eligibleDepartments: ["Electronics", "Computer Science"],
    duration: "6 months",
    deadline: "2026-05-01",
    status: "open",
    createdAt: "2026-02-18",
  },
  {
    id: "p3",
    title: "Blockchain-Based Certificate Verification",
    description: "Develop a decentralized application for verifying academic certificates using blockchain technology. Prevents fraud and ensures tamper-proof record keeping.",
    facultyId: "f3",
    facultyName: "Dr. Ananya Rao",
    facultyEmail: "ananya.rao@mu.edu",
    department: "Computer Science",
    domain: "Blockchain",
    skillsRequired: ["Solidity", "React", "Node.js", "Web3"],
    minCgpa: 8.5,
    eligibleYears: [3, 4],
    eligibleDepartments: ["Computer Science"],
    duration: "5 months",
    deadline: "2026-04-20",
    status: "open",
    createdAt: "2026-02-15",
  },
  {
    id: "p4",
    title: "NLP-Based Research Paper Summarizer",
    description: "Create an NLP tool that automatically summarizes academic research papers, extracting key findings and methodologies. Useful for literature review automation.",
    facultyId: "f1",
    facultyName: "Dr. Priya Sharma",
    facultyEmail: "priya.sharma@mu.edu",
    department: "Data Science",
    domain: "AI",
    skillsRequired: ["Python", "NLP", "Transformers", "Flask"],
    minCgpa: 8.0,
    eligibleYears: [3, 4],
    eligibleDepartments: ["Computer Science", "Data Science"],
    duration: "3 months",
    deadline: "2026-03-30",
    status: "open",
    createdAt: "2026-02-10",
  },
  {
    id: "p5",
    title: "Smart Library Management System",
    description: "Build a comprehensive library management system with RFID integration, automated checkout, book recommendation engine, and analytics dashboard for librarians.",
    facultyId: "f4",
    facultyName: "Prof. Meena Iyer",
    facultyEmail: "meena.iyer@mu.edu",
    department: "Information Technology",
    domain: "Web",
    skillsRequired: ["React", "Node.js", "PostgreSQL", "RFID"],
    minCgpa: 7.0,
    eligibleYears: [2, 3],
    eligibleDepartments: ["Computer Science", "Information Technology"],
    duration: "4 months",
    deadline: "2026-04-10",
    status: "open",
    createdAt: "2026-02-05",
  },
  {
    id: "p6",
    title: "Autonomous Drone Navigation",
    description: "Research and develop path planning algorithms for autonomous drone navigation in GPS-denied environments using computer vision and SLAM techniques.",
    facultyId: "f2",
    facultyName: "Prof. Rajesh Kumar",
    facultyEmail: "rajesh.kumar@mu.edu",
    department: "Electronics",
    domain: "Robotics",
    skillsRequired: ["Python", "ROS", "Computer Vision", "C++"],
    minCgpa: 8.5,
    eligibleYears: [4],
    eligibleDepartments: ["Electronics", "Mechanical"],
    duration: "6 months",
    deadline: "2026-05-15",
    status: "closed",
    createdAt: "2026-01-20",
  },
];

export const mockApplications: Application[] = [
  {
    id: "a1",
    projectId: "p1",
    projectTitle: "AI-Powered Student Performance Predictor",
    studentId: "s1",
    studentName: "Arjun Mehta",
    facultyName: "Dr. Priya Sharma",
    status: "shortlisted",
    appliedAt: "2026-02-22",
    statementOfInterest: "I am deeply interested in applying ML to educational analytics.",
  },
  {
    id: "a2",
    projectId: "p4",
    projectTitle: "NLP-Based Research Paper Summarizer",
    studentId: "s1",
    studentName: "Arjun Mehta",
    facultyName: "Dr. Priya Sharma",
    status: "applied",
    appliedAt: "2026-02-25",
    statementOfInterest: "My NLP coursework and personal projects make me a strong fit.",
  },
  {
    id: "a3",
    projectId: "p5",
    projectTitle: "Smart Library Management System",
    studentId: "s1",
    studentName: "Arjun Mehta",
    facultyName: "Prof. Meena Iyer",
    status: "rejected",
    appliedAt: "2026-02-12",
    remarks: "Looking for students with more RFID experience.",
  },
];

export const mockBulletinPosts: BulletinPost[] = [
  {
    id: "b1",
    title: "New AI Research Projects Available",
    content: "Dr. Priya Sharma has posted two new AI research projects. Students with ML experience are encouraged to apply before the deadline.",
    type: "announcement",
    createdBy: "Admin",
    createdAt: "2026-02-28",
  },
  {
    id: "b2",
    title: "Deadline Reminder: IoT Monitoring System",
    content: "The application deadline for the Campus IoT Monitoring System project is May 1st, 2026. Don't miss out!",
    type: "deadline",
    createdBy: "Prof. Rajesh Kumar",
    createdAt: "2026-02-27",
  },
  {
    id: "b3",
    title: "Profile Completion Drive",
    content: "All students are requested to complete their profiles by March 15th. Incomplete profiles may not be considered for project allocations.",
    type: "notice",
    createdBy: "Admin",
    createdAt: "2026-02-26",
  },
  {
    id: "b4",
    title: "Workshop: Getting Started with Blockchain",
    content: "A 2-day workshop on blockchain development will be held on March 10-11. Registration is open for all departments.",
    type: "general",
    createdBy: "Dr. Ananya Rao",
    createdAt: "2026-02-24",
  },
];

// Faculty-side mock data
export const mockFacultyApplicants = [
  {
    applicationId: "a1",
    studentName: "Arjun Mehta",
    rollNumber: "SE23UCSE045",
    department: "Computer Science",
    year: 3,
    cgpa: 8.7,
    skills: ["Python", "React", "Machine Learning", "TensorFlow", "SQL"],
    appliedAt: "2026-02-22",
    status: "shortlisted" as const,
    statementOfInterest: "I am deeply interested in applying ML to educational analytics.",
  },
  {
    applicationId: "a4",
    studentName: "Sneha Patel",
    rollNumber: "SE23UDS012",
    department: "Data Science",
    year: 3,
    cgpa: 9.1,
    skills: ["Python", "Machine Learning", "Deep Learning", "SQL", "Tableau"],
    appliedAt: "2026-02-23",
    status: "applied" as const,
    statementOfInterest: "I want to explore predictive modeling in an educational context.",
  },
  {
    applicationId: "a5",
    studentName: "Vikram Singh",
    rollNumber: "SE23UCSE078",
    department: "Computer Science",
    year: 4,
    cgpa: 7.9,
    skills: ["Python", "Java", "SQL"],
    appliedAt: "2026-02-24",
    status: "applied" as const,
    statementOfInterest: "Looking to gain hands-on experience in ML applications.",
  },
];

export const mockAdminUsers: User[] = [
  { id: "s1", name: "Arjun Mehta", email: "arjun@mu.edu", role: "student", department: "Computer Science" },
  { id: "s2", name: "Sneha Patel", email: "sneha@mu.edu", role: "student", department: "Data Science" },
  { id: "s3", name: "Vikram Singh", email: "vikram@mu.edu", role: "student", department: "Computer Science" },
  { id: "f1", name: "Dr. Priya Sharma", email: "priya.sharma@mu.edu", role: "faculty", department: "Computer Science" },
  { id: "f2", name: "Prof. Rajesh Kumar", email: "rajesh.kumar@mu.edu", role: "faculty", department: "Electronics" },
  { id: "f3", name: "Dr. Ananya Rao", email: "ananya.rao@mu.edu", role: "faculty", department: "Computer Science" },
  { id: "f4", name: "Prof. Meena Iyer", email: "meena.iyer@mu.edu", role: "faculty", department: "Information Technology" },
];
