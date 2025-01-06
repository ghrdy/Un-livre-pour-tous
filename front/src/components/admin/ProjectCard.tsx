import { Project } from "@/lib/api/projects";
import { ProfileAvatar } from "@/components/ui/profile-avatar";
import { ChevronRight } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border cursor-pointer active:bg-gray-50"
    >
      <ProfileAvatar imageUrl={project.image} name={project.nom} size="lg" />

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold truncate">{project.nom}</h3>
        <p className="text-sm text-muted-foreground">{project.annee}</p>
      </div>

      <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
    </div>
  );
}
