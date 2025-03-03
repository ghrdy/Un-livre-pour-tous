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
import { Project, updateProject } from "@/lib/api/projects";
import { useAuth } from "@/lib/auth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { API_URL } from "@/lib/api/config";
import { getUsers, User } from "@/lib/api/users";
import { X, Search } from "lucide-react";

interface EditProjectDialogProps {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectUpdated: () => void;
}

export default function EditProjectDialog({
  project,
  open,
  onOpenChange,
  onProjectUpdated,
}: EditProjectDialogProps) {
  const { accessToken } = useAuth();
  const [formData, setFormData] = useState({
    nom: project.nom,
    annee: project.annee,
    image: null as File | null,
  });
  const [users, setUsers] = useState<User[]>([]);
  const [selectedAnimateurs, setSelectedAnimateurs] = useState<string[]>(
    project.animateurs || []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!accessToken) return;
        const fetchedUsers = await getUsers(accessToken);
        setUsers(fetchedUsers);
        
        // Set selected users based on project.animateurs
        if (project.animateurs && project.animateurs.length > 0) {
          const selected = fetchedUsers.filter(user => 
            project.animateurs.includes(user._id)
          );
          setSelectedUsers(selected);
        }
      } catch (error) {
        toast.error("Échec du chargement des utilisateurs");
      }
    };

    if (open) {
      fetchUsers();
      setFormData({
        nom: project.nom,
        annee: project.annee,
        image: null,
      });
      setSelectedAnimateurs(project.animateurs || []);
    }
  }, [open, accessToken, project]);

  useEffect(() => {
    // Filter users based on search query
    if (searchQuery.trim() === "") {
      setFilteredUsers([]);
    } else {
      const filtered = users.filter(
        user => 
          !selectedAnimateurs.includes(user._id) && 
          (user.nom.toLowerCase().includes(searchQuery.toLowerCase()) || 
           user.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
           user.email.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users, selectedAnimateurs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nom", formData.nom);
      formDataToSend.append("annee", formData.annee.toString());
      if (formData.image) {
        formDataToSend.append("photo", formData.image);
      }
      formDataToSend.append("animateurs", JSON.stringify(selectedAnimateurs));

      if (!accessToken) {
        throw new Error("No access token available");
      }

      await updateProject(project._id, formDataToSend, accessToken);
      toast.success("Le projet a été mis à jour");
      onProjectUpdated();
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Echec de la mise à jour du projet"
      );
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const addUser = (user: User) => {
    if (!selectedAnimateurs.includes(user._id)) {
      setSelectedAnimateurs([...selectedAnimateurs, user._id]);
      setSelectedUsers([...selectedUsers, user]);
      setSearchQuery("");
    }
  };

  const removeUser = (userId: string) => {
    setSelectedAnimateurs(selectedAnimateurs.filter(id => id !== userId));
    setSelectedUsers(selectedUsers.filter(user => user._id !== userId));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editer le projet</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du Projet</Label>
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
            <Label>Image actuelle</Label>
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
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
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Nouvelle image (optionnel)</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="animateurs">Animateurs</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un utilisateur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            
            {/* Search results */}
            {filteredUsers.length > 0 && (
              <div className="border rounded-md mt-1 max-h-40 overflow-y-auto">
                {filteredUsers.map(user => (
                  <div 
                    key={user._id} 
                    className="p-2 hover:bg-muted cursor-pointer flex items-center justify-between"
                    onClick={() => addUser(user)}
                  >
                    <div>
                      <span className="font-medium">{user.prenom} {user.nom}</span>
                      <span className="text-xs text-muted-foreground ml-2">({user.role})</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={(e) => {
                      e.stopPropagation();
                      addUser(user);
                    }}>
                      Ajouter
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Selected users */}
            <div className="mt-2">
              <h4 className="text-sm font-medium mb-1">Utilisateurs sélectionnés:</h4>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {selectedUsers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucun utilisateur sélectionné</p>
                ) : (
                  selectedUsers.map(user => (
                    <div key={user._id} className="flex items-center justify-between bg-muted p-2 rounded-md">
                      <div>
                        <span className="font-medium">{user.prenom} {user.nom}</span>
                        <span className="text-xs text-muted-foreground ml-2">({user.role})</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeUser(user._id)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          <Button type="submit" className="w-full">
            Mettre à jour le projet
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}