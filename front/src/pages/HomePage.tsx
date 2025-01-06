import { Button } from "@/components/ui/button";
import { UserPlus, BookPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import Logo from "../assets/Logo.svg?react";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <div className="min-h-[80vh] flex flex-col justify-center space-y-12">
      <section className="text-center space-y-6">
        <div className="relative">
          <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 rounded-full" />
          <h1 className="text-5xl font-bold tracking-tight relative">
            <Logo className="inline-block h-48 w-48 mb-2" />
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Une plateforme moderne et intuitive conçue pour simplifier les
          opérations de bibliothèque et améliorer l'expérience de lecture pour
          tous.
        </p>
        {!isAuthenticated && (
          <div className="flex justify-center gap-4">
            <Link to="/login">
              <Button size="lg" className="gap-2">
                Commencer
              </Button>
            </Link>
          </div>
        )}
      </section>

      {/* Mobile Quick Access - Only for authenticated users */}
      {isAuthenticated && (
        <div className="md:hidden space-y-6 px-4">
          <h2 className="text-2xl font-semibold">Accès rapides</h2>
          <div className="space-y-4">
            <Link to="/children?action=add" className="block">
              <Button
                variant="outline"
                size="lg"
                className="w-full bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
              >
                <UserPlus className="mr-2 h-5 w-5" />
                Ajouter un enfant
              </Button>
            </Link>
            <Link to="/books?action=add" className="block">
              <Button
                variant="outline"
                size="lg"
                className="w-full bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
              >
                <BookPlus className="mr-2 h-5 w-5" />
                Ajouter un livre
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Desktop View */}
      <div className="hidden md:block max-w-6xl mx-auto px-4 w-full">
        {isAuthenticated && isAdmin ? <AdminDashboard /> : null}
      </div>
    </div>
  );
}
