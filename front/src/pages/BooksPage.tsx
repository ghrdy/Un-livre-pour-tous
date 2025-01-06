import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import BooksManagement from "@/components/books/BooksManagement";
import { useModalStore } from "@/lib/stores/modalStore";

export default function BooksPage() {
  const [searchParams] = useSearchParams();
  const setShowAddBook = useModalStore((state) => state.setShowAddBook);

  useEffect(() => {
    if (searchParams.get("action") === "add") {
      setShowAddBook(true);
    }
  }, [searchParams, setShowAddBook]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Livres</h1>
        <p className="text-muted-foreground">Gérer le catalogue de livres</p>
      </div>
      <BooksManagement />
    </div>
  );
}
