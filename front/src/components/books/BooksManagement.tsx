import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BookPlus, Pencil, Trash2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import AddBookDialog from "./AddBookDialog";
import EditBookDialog from "./EditBookDialog";
import { Book, getBooks, deleteBook } from "@/lib/api/books";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { SearchBar } from "@/components/worker/SearchBar";
import { useModalStore } from "@/lib/stores/modalStore";
import { BooksList } from "./BooksList";
import { BookDetailView } from "./BookDetailView";
import { API_URL } from "@/lib/api/config";

export default function BooksManagement() {
  const { accessToken } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { showAddBook, setShowAddBook } = useModalStore();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showEditBook, setShowEditBook] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [showBookDetail, setShowBookDetail] = useState(false);

  const fetchBooks = async () => {
    try {
      if (!accessToken) return;
      const fetchedBooks = await getBooks(accessToken);
      setBooks(fetchedBooks);
      setFilteredBooks(fetchedBooks);
    } catch (error) {
      toast.error("Échec du chargement des livres");
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [accessToken]);

  useEffect(() => {
    const filtered = books.filter((book) =>
      book.titre.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBooks(filtered);
  }, [searchQuery, books]);

  const handleEditBook = (book: Book) => {
    setSelectedBook(book);
    setShowEditBook(true);
  };

  const handleDeleteBook = (book: Book) => {
    setBookToDelete(book);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      if (!bookToDelete || !accessToken) return;

      await deleteBook(bookToDelete._id, accessToken);
      toast.success("Livre supprimé avec succès");
      fetchBooks();
    } catch (error) {
      toast.error("Échec de la suppression");
    } finally {
      setShowDeleteDialog(false);
      setBookToDelete(null);
    }
  };

  const handleSelectBook = (book: Book) => {
    setSelectedBook(book);
    setShowBookDetail(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="w-full flex justify-between gap-4">
          <Button onClick={() => setShowAddBook(true)}>
            <BookPlus className="mr-2 h-4 w-4" />
            Ajouter un livre
          </Button>
          <div className="w-1/3">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Rechercher un livre..."
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Table pour mobile */}
        <div className="md:hidden">
          <BooksList books={filteredBooks} onSelectBook={handleSelectBook} />
        </div>
        {/* Table pour desktop */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Photo</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBooks.map((book) => (
                <TableRow key={book._id}>
                  <TableCell>
                    <Avatar>
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
                  </TableCell>
                  <TableCell>{book.titre}</TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditBook(book)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Modifier</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteBook(book)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Supprimer</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <AddBookDialog
        open={showAddBook}
        onOpenChange={setShowAddBook}
        onBookAdded={fetchBooks}
      />

      {selectedBook && (
        <>
          <EditBookDialog
            book={selectedBook}
            open={showEditBook}
            onOpenChange={setShowEditBook}
            onBookUpdated={fetchBooks}
          />
        </>
      )}

      {showBookDetail && selectedBook && (
        <BookDetailView
          book={selectedBook}
          onBack={() => setShowBookDetail(false)}
          onEdit={() => {
            setShowEditBook(true);
            setShowBookDetail(false);
          }}
          onDelete={() => {
            handleDeleteBook(selectedBook);
            setShowBookDetail(false);
          }}
        />
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le livre sera définitivement
              supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
