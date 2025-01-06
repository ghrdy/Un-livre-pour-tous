import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { ProfileAvatar } from "@/components/ui/profile-avatar";
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
import { Project } from "@/lib/api/projects";

interface ProjectDetailViewProps {
  project: Project;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ProjectDetailView({
  project,
  onBack,
  onEdit,
  onDelete,
}: ProjectDetailViewProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    setShowDeleteDialog(false);
    onDelete();
  };

  return (
    <div className="absolute inset-0 bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center px-4 pt-8 pb-20">
        <ProfileAvatar
          imageUrl={project.image}
          name={project.nom}
          size="lg"
          className="h-32 w-32"
        />

        <h2 className="mt-4 text-2xl font-bold">{project.nom}</h2>
        <p className="text-muted-foreground">{project.annee}</p>

        <div className="mt-8 w-full max-w-sm space-y-4">
          <Button variant="outline" className="w-full" onClick={onEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Modifier les informations
          </Button>

          <Button
            variant="outline"
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer le projet
          </Button>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le projet sera définitivement
              supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
