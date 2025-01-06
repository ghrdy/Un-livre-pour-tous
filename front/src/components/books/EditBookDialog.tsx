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
import { Book, updateBook } from "@/lib/api/books";
import { useAuth } from "@/lib/auth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { API_URL } from "@/lib/api/config";

interface EditBookDialogProps {
  book: Book;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBookUpdated: () => void;
}

export default function EditBookDialog({
  book,
  open,
  onOpenChange,
  onBookUpdated,
}: EditBookDialogProps) {
  const { accessToken } = useAuth();
  const [formData, setFormData] = useState({
    titre: book.titre,
    photo: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("titre", formData.titre);
      if (formData.photo) {
        formDataToSend.append("photo", formData.photo);
      }

      if (!accessToken) {
        throw new Error("No access token available");
      }

      await updateBook(book._id, formDataToSend, accessToken);
      toast.success("Le livre a été modifié");
      onBookUpdated();
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Echec de la modification du livre"
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
          <DialogTitle>Modifier le livre</DialogTitle>
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
            <Label>Photo actuelle</Label>
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                {book.photo ? (
                  <AvatarImage
                    src={`${API_URL}${book.photo}`}
                    alt={book.titre}
                  />
                ) : (
                  <AvatarFallback>
                    {book.titre.charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="photo">Nouvelle photo (optionnel)</Label>
            <Input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <Button type="submit" className="w-full">
            Modifier le livre
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
