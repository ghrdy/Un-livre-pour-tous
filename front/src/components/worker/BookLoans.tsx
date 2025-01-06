import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { BookPlus, BookCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import {
  BookLoan,
  getBookLoansByUserId,
  createBookLoan,
  deleteBookLoan,
} from "@/lib/api/bookLoans";
import { Book, getBooks } from "@/lib/api/books";
import { ChildProfile, updateChildProfile } from "@/lib/api/children";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ChildLoansDialogProps {
  child: ChildProfile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ChildLoansDialog({
  child,
  open,
  onOpenChange,
}: ChildLoansDialogProps) {
  const { accessToken } = useAuth();
  const [loans, setLoans] = useState<BookLoan[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [showAddLoan, setShowAddLoan] = useState(false);
  const [showNewLoanButton, setShowNewLoanButton] = useState(true);
  const [newLoan, setNewLoan] = useState({
    bookId: "",
    returnDate: "",
  });
  const [showReturnDialog, setShowReturnDialog] = useState(false);
  const [loanToReturn, setLoanToReturn] = useState<BookLoan | null>(null);

  const fetchLoans = async () => {
    try {
      if (!accessToken) return;
      const childLoans = await getBookLoansByUserId(child._id, accessToken);
      setLoans(childLoans);

      // Update child status based on active loans
      const hasActiveLoan = childLoans.length > 0;
      if (hasActiveLoan && child.status === "possible") {
        updateChildStatus("retour");
      } else if (!hasActiveLoan && child.status === "retour") {
        updateChildStatus("possible");
      }
    } catch (error) {
      toast.error("Echec lors de la récupération des emprunts");
    }
  };

  const updateChildStatus = async (newStatus: string) => {
    try {
      if (!accessToken) return;
      const formData = new FormData();
      formData.append("status", newStatus);
      await updateChildProfile(child._id, formData, accessToken);
    } catch (error) {
      console.error("Failed to update child status:", error);
    }
  };

  const fetchBooks = async () => {
    try {
      if (!accessToken) return;
      const fetchedBooks = await getBooks(accessToken);
      setBooks(fetchedBooks);
    } catch (error) {
      toast.error("Echec lors de la récupération des livres");
    }
  };

  useEffect(() => {
    if (open) {
      fetchLoans();
      setShowNewLoanButton(true);
      setShowAddLoan(false);
    }
  }, [open, accessToken, child._id]);

  const handleAddLoanClick = async () => {
    if (loans.length > 0) {
      toast.error("L'enfant a déjà un emprunt en cours");
      return;
    }
    if (child.status === "restreint") {
      toast.error("L'enfant est restreint et ne peut pas emprunter");
      return;
    }
    setShowAddLoan(true);
    setShowNewLoanButton(false);
    await fetchBooks();
  };

  const handleCancelAddLoan = () => {
    setShowAddLoan(false);
    setShowNewLoanButton(true);
    setNewLoan({ bookId: "", returnDate: "" });
  };

  const handleAddLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!accessToken) return;

      if (!newLoan.bookId) {
        toast.error("Veuillez choisir un livre");
        return;
      }

      const selectedBook = books.find((book) => book._id === newLoan.bookId);
      if (!selectedBook) {
        toast.error("Livre non trouvé");
        return;
      }

      await createBookLoan(
        {
          book: selectedBook,
          childId: child._id,
          returnDate: newLoan.returnDate,
        },
        accessToken
      );

      toast.success("L'emprunt a été ajouté avec succès");
      setNewLoan({ bookId: "", returnDate: "" });
      setShowAddLoan(false);
      setShowNewLoanButton(true);
      fetchLoans();
    } catch (error) {
      toast.error("Echec lors de l'ajout de l'emprunt");
    }
  };

  const handleReturnBook = (loan: BookLoan) => {
    setLoanToReturn(loan);
    setShowReturnDialog(true);
  };

  const confirmReturn = async () => {
    try {
      if (!loanToReturn || !accessToken) return;

      await deleteBookLoan(loanToReturn._id, accessToken);
      toast.success("Le livre a été retourné avec succès");
      fetchLoans();
    } catch (error) {
      toast.error("Echec lors du retour du livre");
    } finally {
      setShowReturnDialog(false);
      setLoanToReturn(null);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Emprunts de {child.prenom} {child.nom}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {showNewLoanButton && loans.length === 0 && (
              <Button onClick={handleAddLoanClick}>
                <BookPlus className="mr-2 h-4 w-4" />
                Nouvel emprunt
              </Button>
            )}

            {showAddLoan && (
              <form onSubmit={handleAddLoan} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="book">Livre</Label>
                    <Select
                      value={newLoan.bookId}
                      onValueChange={(value) =>
                        setNewLoan({ ...newLoan, bookId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir un livre" />
                      </SelectTrigger>
                      <SelectContent>
                        {books.map((book) => (
                          <SelectItem key={book._id} value={book._id}>
                            {book.titre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="returnDate">Date de retour</Label>
                    <input
                      id="returnDate"
                      type="date"
                      value={newLoan.returnDate}
                      onChange={(e) =>
                        setNewLoan({ ...newLoan, returnDate: e.target.value })
                      }
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelAddLoan}
                  >
                    Annuler
                  </Button>
                  <Button type="submit">Ajouter</Button>
                </div>
              </form>
            )}

            {loans.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre du livre</TableHead>
                    <TableHead>Date d'emprunt</TableHead>
                    <TableHead>Date de retour</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loans.map((loan) => (
                    <TableRow key={loan._id}>
                      <TableCell>{loan.book.titre}</TableCell>
                      <TableCell>
                        {new Date(loan.loanDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(loan.returnDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleReturnBook(loan)}
                              >
                                <BookCheck className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Retourner le livre</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p>Aucun emprunt en cours</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showReturnDialog} onOpenChange={setShowReturnDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer le retour</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir confirmer le retour de ce livre ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmReturn}>
              Confirmer le retour
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
