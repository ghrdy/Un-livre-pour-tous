import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { createUser } from "@/lib/api/users";
import { getProjects, Project } from "@/lib/api/projects";
import { useAuth } from "@/lib/auth";

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserAdded: () => void;
}

const initialFormData = {
  prenom: "",
  nom: "",
  email: "",
  role: "",
  projet: "",
};

export function AddUserDialog({
  open,
  onOpenChange,
  onUserAdded,
}: AddUserDialogProps) {
  const { accessToken } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (!accessToken) return;
        const fetchedProjects = await getProjects(accessToken);
        setProjects(fetchedProjects);
      } catch (error) {
        toast.error("Échec du chargement des projets");
      }
    };

    if (open) {
      fetchProjects();
    }
  }, [open, accessToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!accessToken) {
        throw new Error("No access token available");
      }

      await createUser(formData, accessToken);
      toast.success("L'utilisateur est ajouté");
      onUserAdded();
      onOpenChange(false);
      setFormData(initialFormData);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Echec lors de l'ajout de l'utilisateur"
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prenom">Prénom</Label>
            <Input
              id="prenom"
              value={formData.prenom}
              onChange={(e) =>
                setFormData({ ...formData, prenom: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nom">Nom</Label>
            <Input
              id="nom"
              value={formData.nom}
              onChange={(e) =>
                setFormData({ ...formData, nom: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Adresse Mail</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Rôle</Label>
            <Select
              value={formData.role}
              onValueChange={(value) =>
                setFormData({ ...formData, role: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir un Rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrateur</SelectItem>
                <SelectItem value="referent">Animateur référent</SelectItem>
                <SelectItem value="simple">Animateur Simple</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="projet">Projet</Label>
            <Select
              value={formData.projet}
              onValueChange={(value) =>
                setFormData({ ...formData, projet: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir un Projet" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project._id} value={project._id}>
                    {project.nom} ({project.annee})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">
            Créer l'utilisateur
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddUserDialog;
