import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookPlus, Pencil, Trash2 } from "lucide-react";
import { ProfileAvatar } from "@/components/ui/profile-avatar";
import { ChildStatus } from "./ChildStatus";
import { formatDate } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
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
import { ChildProfile } from "@/lib/api/children";

interface ChildDetailViewProps {
  child: ChildProfile;
  onBack: () => void;
  onRestrict: () => void;
  onLoan: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ChildDetailView({
  child,
  onBack,
  onRestrict,
  onLoan,
  onEdit,
  onDelete,
}: ChildDetailViewProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    setShowDeleteDialog(false);
    onDelete();
  };

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Restreindre</span>
            <Switch
              checked={child.status === "restreint"}
              onCheckedChange={() => onRestrict()}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center px-4 pt-8 pb-20">
        <ProfileAvatar
          imageUrl={child.photo}
          name={`${child.prenom} ${child.nom}`}
          size="lg"
          className="h-32 w-32"
        />

        <h2 className="mt-4 text-2xl font-bold">
          {child.prenom} {child.nom}
        </h2>

        <div className="mt-2">
          <ChildStatus status={child.status} />
        </div>

        <Button className="mt-6 w-full max-w-sm" onClick={onLoan}>
          <BookPlus className="mr-2 h-5 w-5" />
          Enregistrer un emprunt
        </Button>

        <div className="mt-8 w-full max-w-sm">
          <h3 className="text-lg font-semibold mb-4">Informations générales</h3>
          <div className="space-y-4">
            <InfoSection label="Classe" value={child.classeSuivie} />
            <InfoSection
              label="Date de naissance"
              value={formatDate(child.dateNaissance)}
            />
            {child.noteObservation && (
              <InfoSection
                label="Notes / Observations"
                value={child.noteObservation}
              />
            )}
          </div>

          <div className="mt-8 space-y-3">
            <Button variant="outline" className="w-full" onClick={onEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              Modifier les informations
            </Button>
            <Button
              variant="outline"
              className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer la fiche
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La fiche de {child.prenom}{" "}
              {child.nom} sera définitivement supprimée.
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

function InfoSection({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-1">{value}</p>
    </div>
  );
}
