import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { createProject } from "@/lib/api/projects";
import { useAuth } from "@/lib/auth";
import { getUsers, User } from "@/lib/api/users";

interface AddProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectAdded: () => void;
}

export default function AddProjectDialog({
  open,
  onOpenChange,
  onProjectAdded,
}: AddProjectDialogProps) {
  const { accessToken } = useAuth();
  const [formData, setFormData] = useState({
    nom: "",
    annee: new Date().getFullYear(),
    image: null as File | null,
  });
  const [users, setUsers] = useState<User[]>([]);
  const [selectedAnimateurs, setSelectedAnimateurs] = useState<string[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!accessToken || !open) return;
        const fetchedUsers = await getUsers(accessToken);
        setUsers(fetchedUsers);
      } catch (error) {
        toast.error("Échec du chargement des utilisateurs");
      }
    };

    if (open) {
      fetchUsers();
      // Reset form data when dialog opens
      setFormData({
        nom: "",
        annee: new Date().getFullYear(),
        image: null,
      });
      setSelectedAnimateurs([]);
    }
  }, [open, accessToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!accessToken) {
        throw new Error("No access token available");
      }

      const formDataToSend = new FormData();
      formDataToSend.append("nom", formData.nom);
      formDataToSend.append("annee", formData.annee.toString());
      if (formData.image) {
        formDataToSend.append("photo", formData.image);
      }
      formDataToSend.append("animateurs", JSON.stringify(selectedAnimateurs));

      await createProject(formDataToSend, accessToken);
      toast.success("Le projet a été créé avec succès");
      onProjectAdded();
      onOpenChange(false);
      setFormData({
        nom: "",
        annee: new Date().getFullYear(),
        image: null,
      });
      setSelectedAnimateurs([]);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Echec lors de la création du projet"
      );
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const handleAnimateurChange = (userId: string) => {
    if (selectedAnimateurs.includes(userId)) {
      setSelectedAnimateurs(selectedAnimateurs.filter(id => id !== userId));
    } else {
      setSelectedAnimateurs([...selectedAnimateurs, userId]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau projet</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du projet</Label>
            <Input
              id="name"
              value={formData.nom}
              onChange={(e) =>
                setFormData({ ...formData, nom: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="year">Année</Label>
            <Input
              id="year"
              type="number"
              value={formData.annee}
              onChange={(e) =>
                setFormData({ ...formData, annee: parseInt(e.target.value) })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="animateurs">Animateurs</Label>
            <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
              {users.map((user) => (
                <div key={user._id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`user-${user._id}`}
                    checked={selectedAnimateurs.includes(user._id)}
                    onChange={() => handleAnimateurChange(user._id)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor={`user-${user._id}`} className="text-sm">
                    {user.prenom} {user.nom} ({user.role})
                  </label>
                </div>
              ))}
            </div>
          </div>
          <Button type="submit" className="w-full">
            Ajouter le projet
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}