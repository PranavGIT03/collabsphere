import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User } from "lucide-react";
import type { Project } from "@/lib/types";

interface ProjectCardProps {
  project: Project;
  linkPrefix?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, linkPrefix = "/student" }) => {
  return (
    <div className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-all duration-200 hover:border-primary/30 animate-fade-in">
      <div className="h-1.5 bg-primary" />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <Link to={`${linkPrefix}/projects/${project.id}`}>
              <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 text-base">
                {project.title}
              </h3>
            </Link>
            <div className="flex items-center gap-1.5 mt-1.5 text-muted-foreground text-sm">
              <User className="w-3.5 h-3.5" />
              <span>{project.faculty_name}</span>
            </div>
          </div>
          <Badge variant={project.status === "open" ? "default" : "secondary"} className="shrink-0 text-xs">
            {project.status}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{project.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.skills_required.slice(0, 4).map((skill) => (
            <span key={skill} className="px-2 py-0.5 bg-muted text-muted-foreground rounded-md text-xs font-medium">
              {skill}
            </span>
          ))}
          {project.skills_required.length > 4 && (
            <span className="px-2 py-0.5 bg-muted text-muted-foreground rounded-md text-xs">
              +{project.skills_required.length - 4}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {project.duration && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{project.duration}</span>}
            {project.deadline && <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{project.deadline}</span>}
          </div>
          <Link to={`${linkPrefix}/projects/${project.id}`}>
            <Button size="sm" variant="outline" className="text-xs h-8">View</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
