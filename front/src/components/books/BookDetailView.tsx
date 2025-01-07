import { Button } from "@/components/ui/button";
import { ArrowLeft, BookPlus, Pencil, Trash2 } from "lucide-react";
import { ProfileAvatar } from "@/components/ui/profile-avatar";
import { Book } from "@/lib/api/books";

interface BookDetailViewProps {
  book: Book;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function BookDetailView({
  book,
  onBack,
  onEdit,
  onDelete,
}: BookDetailViewProps) {
  const handleDelete = () => {
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
          imageUrl={book.photo}
          name={book.titre}
          size="lg"
          className="h-32 w-32"
        />

        <h2 className="mt-4 text-2xl font-bold">{book.titre}</h2>

        <div className="mt-8 w-full max-w-sm">
          <Button variant="outline" className="w-full" onClick={onEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Modifier les informations
          </Button>
          <Button
            variant="outline"
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 mt-4"
            onClick={handleDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer le livre
          </Button>
        </div>
      </div>

      <div className="fixed bottom-4 right-4">
        <Button variant="default" size="icon" onClick={onEdit}>
          <BookPlus className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
