import React from "react";
import { Badge } from "@/components/ui/badge";

type StatusType = "applied" | "shortlisted" | "selected" | "rejected";

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  applied: { label: "Applied", className: "bg-info/10 text-info border-info/20" },
  shortlisted: { label: "Shortlisted", className: "bg-warning/10 text-warning border-warning/20" },
  selected: { label: "Selected", className: "bg-success/10 text-success border-success/20" },
  rejected: { label: "Rejected", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

const StatusBadge: React.FC<{ status: StatusType }> = ({ status }) => {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={`${config.className} font-medium text-xs`}>
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
