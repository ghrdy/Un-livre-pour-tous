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
import { Search, X } from "lucide-react";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

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
      setSelectedUsers([]);
      setSearchQuery("");
    }
  }, [open, accessToken]);

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
      setSelectedUsers([]);
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
            Ajouter le projet
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}