import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FolderPlus, Pencil, Trash2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import AddProjectDialog from "./AddProjectDialog";
import EditProjectDialog from "./EditProjectDialog";
import { Project, getProjects, deleteProject } from "@/lib/api/projects";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { SearchBar } from "@/components/worker/SearchBar";
import { ProjectsList } from "./ProjectsList";
import { ProjectDetailView } from "./ProjectDetailView";
import { API_URL } from "@/lib/api/config";

export default function ProjectManagement() {
  const { accessToken } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddProject, setShowAddProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showEditProject, setShowEditProject] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [showProjectDetail, setShowProjectDetail] = useState(false);

  const fetchProjects = async () => {
    try {
      if (!accessToken) return;
      const fetchedProjects = await getProjects(accessToken);
      setProjects(fetchedProjects);
      setFilteredProjects(fetchedProjects);
    } catch (error) {
      toast.error("Echec lors de la récupération des projets");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [accessToken]);

  useEffect(() => {
    const filtered = projects.filter((project) =>
      project.nom.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProjects(filtered);
  }, [searchQuery, projects]);

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setShowEditProject(true);
  };

  const handleDeleteProject = (project: Project) => {
    setProjectToDelete(project);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      if (!projectToDelete || !accessToken) return;

      await deleteProject(projectToDelete._id, accessToken);
      toast.success("Le projet a été supprimé avec succès");
      fetchProjects();
    } catch (error) {
      toast.error("Echec lors de la suppression du projet");
    } finally {
      setShowDeleteDialog(false);
      setProjectToDelete(null);
    }
  };

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    setShowProjectDetail(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="w-full flex justify-between gap-4">
          <Button onClick={() => setShowAddProject(true)}>
            <FolderPlus className="mr-2 h-4 w-4" />
            Ajouter un projet
          </Button>
          <div className="w-1/3">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Rechercher un projet..."
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Mobile view */}
        <div className="md:hidden">
          <ProjectsList
            projects={filteredProjects}
            onSelectProject={handleSelectProject}
          />
        </div>

        {/* Desktop view */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Année</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow key={project._id}>
                  <TableCell>
                    <Avatar>
                      {project.image ? (
                        <AvatarImage
                          src={`${API_URL}${project.image}`}
                          alt={project.nom}
                        />
                      ) : (
                        <AvatarFallback>
                          {project.nom.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </TableCell>
                  <TableCell>{project.nom}</TableCell>
                  <TableCell>{project.annee}</TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditProject(project)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Modifier</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteProject(project)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Supprimer</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <AddProjectDialog
        open={showAddProject}
        onOpenChange={setShowAddProject}
        onProjectAdded={fetchProjects}
      />

      {selectedProject && (
        <>
          <EditProjectDialog
            project={selectedProject}
            open={showEditProject}
            onOpenChange={setShowEditProject}
            onProjectUpdated={fetchProjects}
          />
          <ProjectDetailView
            project={selectedProject}
            onBack={() => setShowProjectDetail(false)}
            onEdit={() => {
              setShowEditProject(true);
              setShowProjectDetail(false);
            }}
            onDelete={() => {
              handleDeleteProject(selectedProject);
              setShowProjectDetail(false);
            }}
          />
        </>
      )}

      {showProjectDetail && selectedProject && (
        <ProjectDetailView
          project={selectedProject}
          onBack={() => setShowProjectDetail(false)}
          onEdit={() => {
            setShowEditProject(true);
            setShowProjectDetail(false);
          }}
          onDelete={() => {
            handleDeleteProject(selectedProject);
            setShowProjectDetail(false);
          }}
        />
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le projet sera supprimé du système
              et les données liées seront perdues.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
