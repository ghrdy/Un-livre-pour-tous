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
import { User, UpdateUserData, updateUser } from "@/lib/api/users";
import { useAuth } from "@/lib/auth";
import { getProjects, Project } from "@/lib/api/projects";

interface EditUserDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserUpdated: () => void;
}

export default function EditUserDialog({
  user,
  open,
  onOpenChange,
  onUserUpdated,
}: EditUserDialogProps) {
  const { accessToken } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [formData, setFormData] = useState({
    nom: user.nom,
    prenom: user.prenom,
    email: user.email,
    role: user.role,
    projet: user.projet || "",
    password: "",
  });

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
      const updateData: UpdateUserData = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        role: formData.role,
        projet: formData.projet,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      if (!accessToken) {
        throw new Error("No access token available");
      }

      await updateUser(user._id, updateData, accessToken);
      toast.success("L'utilisateur a été modifié");
      onUserUpdated();
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Echec de la mise à jour de l'utilisateur"
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier l'utilisateur</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                value={formData.prenom}
                onChange={(e) =>
                  setFormData({ ...formData, prenom: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                value={formData.nom}
                onChange={(e) =>
                  setFormData({ ...formData, nom: e.target.value })
                }
                required
              />
            </div>
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
            <Label htmlFor="password">
              Nouveau mot de passse (laisser vide pour garder le mot de passe
              actuel)
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Entrez un nouveau mot de passe"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Rôle</Label>
            <Select
              value={formData.role}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  role: value as "admin" | "referent" | "simple",
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir un rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrateur</SelectItem>
                <SelectItem value="referent">Animateur Référent</SelectItem>
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
            Modifier l'utilisateur
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
