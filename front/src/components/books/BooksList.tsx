import { Book } from "@/lib/api/books";
import { BookCard } from "./BookCard";

interface BooksListProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
}

export function BooksList({ books, onSelectBook }: BooksListProps) {
  return (
    <div className="space-y-2">
      {books.map((book) => (
        <BookCard
          key={book._id}
          book={book}
          onClick={() => onSelectBook(book)}
        />
      ))}
    </div>
  );
}
