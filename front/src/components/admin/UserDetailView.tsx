import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, KeyRound, Pencil, Trash2 } from "lucide-react";
import { ProfileAvatar } from "@/components/ui/profile-avatar";
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
import { User } from "@/lib/api/users";
import { Badge } from "@/components/ui/badge";

interface UserDetailViewProps {
  user: User;
  onBack: () => void;
  onResetPassword: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function UserDetailView({
  user,
  onBack,
  onResetPassword,
  onEdit,
  onDelete,
}: UserDetailViewProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    setShowDeleteDialog(false);
    onDelete();
  };

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrateur";
      case "referent":
        return "Animateur Référent";
      case "simple":
        return "Animateur";
      default:
        return role;
    }
  };

  return (
    <div className="md:relative md:bg-transparent md:p-6">
      {/* Mobile view */}
      <div className="fixed inset-0 bg-background z-50 overflow-auto md:hidden">
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
          <div className="flex items-center justify-between p-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-center px-4 pt-8 pb-20">
          <ProfileAvatar
            imageUrl={null}
            name={`${user.prenom} ${user.nom}`}
            size="lg"
            className="h-32 w-32"
          />

          <h2 className="mt-4 text-2xl font-bold">
            {user.prenom} {user.nom}
          </h2>
          <p className="text-muted-foreground">{user.email}</p>

          <div className="mt-2">
            {!user.validated && (
              <Badge
                variant="secondary"
                className="bg-yellow-100 text-yellow-800"
              >
                En attente de validation
              </Badge>
            )}
            {user.validated && (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                Validé
              </Badge>
            )}
          </div>

          <div className="mt-8 w-full max-w-sm space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informations générales</h3>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Rôle</p>
                <p>{getRoleDisplay(user.role)}</p>
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={onEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              Modifier les informations
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={onResetPassword}
            >
              <KeyRound className="mr-2 h-4 w-4" />
              Réinitialiser le mot de passe
            </Button>

            <Button
              variant="outline"
              className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer l'utilisateur
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop view */}
      <div className="hidden md:block">
        <div className="flex flex-col items-center">
          <ProfileAvatar
            imageUrl={null}
            name={`${user.prenom} ${user.nom}`}
            size="lg"
            className="h-32 w-32"
          />

          <h2 className="mt-4 text-2xl font-bold">
            {user.prenom} {user.nom}
          </h2>
          <p className="text-muted-foreground">{user.email}</p>

          <div className="mt-2">
            {!user.validated && (
              <Badge
                variant="secondary"
                className="bg-yellow-100 text-yellow-800"
              >
                En attente de validation
              </Badge>
            )}
            {user.validated && (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                Validé
              </Badge>
            )}
          </div>

          <div className="mt-8 w-full max-w-sm space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informations générales</h3>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Rôle</p>
                <p>{getRoleDisplay(user.role)}</p>
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={onEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              Modifier les informations
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={onResetPassword}
            >
              <KeyRound className="mr-2 h-4 w-4" />
              Réinitialiser le mot de passe
            </Button>

            <Button
              variant="outline"
              className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer l'utilisateur
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L'utilisateur sera définitivement
              supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
