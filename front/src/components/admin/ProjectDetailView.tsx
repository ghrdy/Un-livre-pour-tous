import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, Trash2, Users, BookOpen, UserPlus } from "lucide-react";
import { ProfileAvatar } from "@/components/ui/profile-avatar";
import { Project } from "@/lib/api/projects";
import { useEffect, useState } from "react";
import { getProjectUsers, getProjectBooks, getProjectChildren } from "@/lib/api/projects";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { User } from "@/lib/api/users";
import { Book } from "@/lib/api/books";
import { ChildProfile } from "@/lib/api/children";

interface ProjectDetailViewProps {
  project: Project;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ProjectDetailView({
  project,
  onBack,
  onEdit,
  onDelete,
}: ProjectDetailViewProps) {
  const { accessToken } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        if (!accessToken) return;
        setLoading(true);
        
        const [fetchedUsers, fetchedBooks, fetchedChildren] = await Promise.all([
          getProjectUsers(project._id, accessToken),
          getProjectBooks(project._id, accessToken),
          getProjectChildren(project._id, accessToken)
        ]);
        
        setUsers(fetchedUsers);
        setBooks(fetchedBooks);
        setChildren(fetchedChildren);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch project details:", error);
        toast.error("Échec du chargement des détails du projet");
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [project._id, accessToken]);

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
          imageUrl={project.image}
          name={project.nom}
          size="lg"
          className="h-32 w-32"
        />

        <h2 className="mt-4 text-2xl font-bold">{project.nom}</h2>
        <p className="text-muted-foreground">{project.annee}</p>

        <div className="mt-8 w-full max-w-md space-y-6">
          {/* Animateurs section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Animateurs ({users.length})
              </h3>
            </div>
            {loading ? (
              <div className="h-20 animate-pulse bg-muted rounded-md"></div>
            ) : (
              <div className="space-y-2">
                {users.length > 0 ? (
                  users.map((user) => (
                    <div key={user._id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <div>
                        <p className="font-medium">{user.prenom} {user.nom}</p>
                        <p className="text-sm text-muted-foreground">{user.role}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">Aucun animateur associé</p>
                )}
              </div>
            )}
          </div>

          {/* Books section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                Livres ({books.length})
              </h3>
            </div>
            {loading ? (
              <div className="h-20 animate-pulse bg-muted rounded-md"></div>
            ) : (
              <div className="space-y-2">
                {books.length > 0 ? (
                  books.map((book) => (
                    <div key={book._id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <div className="flex items-center">
                        <ProfileAvatar imageUrl={book.photo} name={book.titre} size="default" className="mr-2" />
                        <p className="font-medium">{book.titre}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">Aucun livre associé</p>
                )}
              </div>
            )}
          </div>

          {/* Children section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center">
                <UserPlus className="mr-2 h-5 w-5" />
                Enfants ({children.length})
              </h3>
            </div>
            {loading ? (
              <div className="h-20 animate-pulse bg-muted rounded-md"></div>
            ) : (
              <div className="space-y-2">
                {children.length > 0 ? (
                  children.map((child) => (
                    <div key={child._id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <div className="flex items-center">
                        <ProfileAvatar imageUrl={child.photo} name={`${child.prenom} ${child.nom}`} size="default" className="mr-2" />
                        <div>
                          <p className="font-medium">{child.prenom} {child.nom}</p>
                          <p className="text-sm text-muted-foreground">{child.classeSuivie}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">Aucun enfant associé</p>
                )}
              </div>
            )}
          </div>

          <div className="pt-4 space-y-3">
            <Button variant="outline" className="w-full" onClick={onEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              Modifier les informations
            </Button>

            <Button
              variant="outline"
              className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer le projet
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}