import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/lib/auth";
import { getProjects, Project } from "@/lib/api/projects";
import { useProjectStore } from "@/lib/stores/projectStore";
import { toast } from "sonner";

export function ProjectSelector() {
  const { accessToken } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const { activeProject, setActiveProject, clearActiveProject } = useProjectStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (!accessToken) return;
        setLoading(true);
        const fetchedProjects = await getProjects(accessToken);
        setProjects(fetchedProjects);
        
        // If no active project is set and we have projects, set the first one as active
        if (!activeProject && fetchedProjects.length > 0) {
          setActiveProject(fetchedProjects[0]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        toast.error("Échec du chargement des projets");
        setLoading(false);
      }
    };

    fetchProjects();
  }, [accessToken, activeProject, setActiveProject]);

  const handleProjectChange = (projectId: string) => {
    if (projectId === "all") {
      clearActiveProject();
      toast.success("Affichage de tous les éléments");
      return;
    }
    
    const selectedProject = projects.find((project) => project._id === projectId);
    if (selectedProject) {
      setActiveProject(selectedProject);
      toast.success(`Projet "${selectedProject.nom}" sélectionné`);
    }
  };

  if (loading) {
    return <div className="h-10 w-full max-w-xs animate-pulse bg-muted rounded-md"></div>;
  }

  if (projects.length === 0) {
    return <div className="text-muted-foreground">Aucun projet disponible</div>;
  }

  return (
    <div className="w-full max-w-xs">
      <Select
        value={activeProject?._id || "all"}
        onValueChange={handleProjectChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Sélectionner un projet" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tout voir</SelectItem>
          {projects.map((project) => (
            <SelectItem key={project._id} value={project._id}>
              {project.nom} ({project.annee})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}