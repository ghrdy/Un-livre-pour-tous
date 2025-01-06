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
import { useState } from "react";
import { createBook } from "@/lib/api/books";
import { useAuth } from "@/lib/auth";

interface AddBookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBookAdded: () => void;
}

export default function AddBookDialog({
  open,
  onOpenChange,
  onBookAdded,
}: AddBookDialogProps) {
  const { accessToken } = useAuth();
  const [formData, setFormData] = useState({
    titre: "",
    photo: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!accessToken) {
        throw new Error("No access token available");
      }

      const formDataToSend = new FormData();
      formDataToSend.append("titre", formData.titre);
      if (formData.photo) {
        formDataToSend.append("photo", formData.photo);
      }

      await createBook(formDataToSend, accessToken);
      toast.success("Le livre a été ajouté");
      onBookAdded();
      onOpenChange(false);
      setFormData({
        titre: "",
        photo: null,
      });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Echec lors de l'ajout du livre"
      );
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, photo: e.target.files[0] });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un livre</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              value={formData.titre}
              onChange={(e) =>
                setFormData({ ...formData, titre: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="photo">Photo</Label>
            <Input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <Button type="submit" className="w-full">
            Ajouter le livre
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
