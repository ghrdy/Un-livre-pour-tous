import { Project } from "@/lib/api/projects";
import { ProjectCard } from "./ProjectCard";

interface ProjectsListProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

export function ProjectsList({ projects, onSelectProject }: ProjectsListProps) {
  return (
    <div className="space-y-2">
      {projects.map((project) => (
        <ProjectCard
          key={project._id}
          project={project}
          onClick={() => onSelectProject(project)}
        />
      ))}
    </div>
  );
}
