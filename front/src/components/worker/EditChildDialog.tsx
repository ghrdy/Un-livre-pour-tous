import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { ChildProfile, updateChildProfile } from "@/lib/api/children";
import { useAuth } from "@/lib/auth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { API_URL } from "@/lib/api/config";

interface EditChildDialogProps {
  child: ChildProfile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChildUpdated: () => void;
}

export default function EditChildDialog({
  child,
  open,
  onOpenChange,
  onChildUpdated,
}: EditChildDialogProps) {
  const { accessToken } = useAuth();
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    dateNaissance: "",
    classeSuivie: "",
    noteObservation: "",
    status: "",
    photo: null as File | null,
  });

  // Update form data when child prop changes or dialog opens
  useEffect(() => {
    if (open && child) {
      setFormData({
        nom: child.nom,
        prenom: child.prenom,
        dateNaissance: child.dateNaissance.split("T")[0],
        classeSuivie: child.classeSuivie,
        noteObservation: child.noteObservation,
        status: child.status,
        photo: null,
      });
    }
  }, [child, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nom", formData.nom);
      formDataToSend.append("prenom", formData.prenom);
      formDataToSend.append("dateNaissance", formData.dateNaissance);
      formDataToSend.append("classeSuivie", formData.classeSuivie);
      formDataToSend.append("noteObservation", formData.noteObservation);
      formDataToSend.append("status", formData.status);
      if (formData.photo) {
        formDataToSend.append("photo", formData.photo);
      }

      if (!accessToken) {
        throw new Error("No access token available");
      }

      await updateChildProfile(child._id, formDataToSend, accessToken);
      toast.success("Le profil enfant a été modifié");
      onChildUpdated();
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update child profile"
      );
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, photo: e.target.files[0] });
    }
  };

  const handleRestrictionChange = (checked: boolean) => {
    setFormData({
      ...formData,
      status: checked ? "restreint" : "possible",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier le profil enfant</DialogTitle>
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="birthDate">Date de naissance</Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.dateNaissance}
                onChange={(e) =>
                  setFormData({ ...formData, dateNaissance: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="class">Classe</Label>
              <Input
                id="class"
                value={formData.classeSuivie}
                onChange={(e) =>
                  setFormData({ ...formData, classeSuivie: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Photo actuelle</Label>
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                {child.photo ? (
                  <AvatarImage
                    src={`${API_URL}${child.photo}`}
                    alt={child.prenom}
                  />
                ) : (
                  <AvatarFallback>
                    {child.prenom.charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="photo">Nouvelle photo (Optionel)</Label>
            <Input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes / Observations</Label>
            <Input
              id="notes"
              value={formData.noteObservation}
              onChange={(e) =>
                setFormData({ ...formData, noteObservation: e.target.value })
              }
            />
          </div>

          <div className="hidden md:flex items-center justify-between space-x-2">
            <Label htmlFor="restriction">Restreindre l'accès</Label>
            <Switch
              id="restriction"
              checked={formData.status === "restreint"}
              onCheckedChange={handleRestrictionChange}
            />
          </div>

          <Button type="submit" className="w-full">
            Modifier le profil enfant
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
