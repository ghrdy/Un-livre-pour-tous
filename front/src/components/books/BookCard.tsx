import { Book } from "@/lib/api/books";
import { ProfileAvatar } from "@/components/ui/profile-avatar";
import { ChevronRight } from "lucide-react";

interface BookCardProps {
  book: Book;
  onClick: () => void;
}

export function BookCard({ book, onClick }: BookCardProps) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border cursor-pointer active:bg-gray-50"
    >
      <ProfileAvatar imageUrl={book.photo} name={book.titre} size="lg" />

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold truncate">{book.titre}</h3>
      </div>

      <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
    </div>
  );
}
