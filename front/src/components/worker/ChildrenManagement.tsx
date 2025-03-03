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
import { UserPlus, Pencil, Trash2, BookOpen } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import AddChildDialog from "./AddChildDialog";
import EditChildDialog from "./EditChildDialog";
import ChildLoansDialog from "./BookLoans";
import { SearchBar } from "./SearchBar";
import {
  ChildProfile,
  getChildProfiles,
  deleteChildProfile,
  getChildProfile,
} from "@/lib/api/children";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { useModalStore } from "@/lib/stores/modalStore";
import { ChildrenList } from "./ChildrenList";
import { ChildDetailView } from "./child-detail/ChildDetailView";
import { updateChildProfile } from "@/lib/api/children";
import { API_URL } from "@/lib/api/config";
import { useProjectStore } from "@/lib/stores/projectStore";
import { getProjectChildren } from "@/lib/api/projects";

export default function ChildrenManagement() {
  const { accessToken } = useAuth();
  const { activeProject } = useProjectStore();
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [filteredChildren, setFilteredChildren] = useState<ChildProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { showAddChild, setShowAddChild } = useModalStore();
  const [showChildDetail, setShowChildDetail] = useState(false);
  const [selectedChild, setSelectedChild] = useState<ChildProfile | null>(null);
  const [showEditChild, setShowEditChild] = useState(false);
  const [showLoansDialog, setShowLoansDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [childToDelete, setChildToDelete] = useState<ChildProfile | null>(null);

  const fetchChildren = async () => {
    try {
      if (!accessToken) return;
      
      let fetchedChildren: ChildProfile[];
      
      // If we have an active project, fetch children for that project
      if (activeProject) {
        fetchedChildren = await getProjectChildren(activeProject._id, accessToken);
      } else {
        // Otherwise, fetch all children
        fetchedChildren = await getChildProfiles(accessToken);
      }
      
      setChildren(fetchedChildren);
      setFilteredChildren(fetchedChildren);
      
      // Refresh the status of each child
      fetchedChildren.forEach((child) => {
        refreshChildStatus(child._id);
      });
    } catch (error) {
      toast.error("Échec du chargement des profils");
    }
  };

  const refreshChildStatus = async (childId: string) => {
    try {
      if (!accessToken) return;
      const updatedChild = await getChildProfile(childId, accessToken);
      setChildren((prevChildren) =>
        prevChildren.map((child) =>
          child._id === childId ? updatedChild : child
        )
      );
      setFilteredChildren((prevFiltered) =>
        prevFiltered.map((child) =>
          child._id === childId ? updatedChild : child
        )
      );
    } catch (error) {
      console.error("Failed to refresh child status:", error);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, [accessToken, activeProject]);

  useEffect(() => {
    const filtered = children.filter((child) => {
      const searchTerm = searchQuery.toLowerCase();
      return (
        child.nom.toLowerCase().includes(searchTerm) ||
        child.prenom.toLowerCase().includes(searchTerm) ||
        child.classeSuivie.toLowerCase().includes(searchTerm)
      );
    });
    setFilteredChildren(filtered);
  }, [searchQuery, children]);

  const handleEditChild = (child: ChildProfile) => {
    setSelectedChild(child);
    setShowEditChild(true);
  };

  const handleViewLoans = (child: ChildProfile) => {
    setSelectedChild(child);
    setShowLoansDialog(true);
  };

  const handleDeleteChild = (child: ChildProfile) => {
    setChildToDelete(child);
    setShowDeleteDialog(true);
  };

  const handleLoansDialogClose = (childId: string) => {
    setShowLoansDialog(false);
    refreshChildStatus(childId);
  };

  const handleSelectChild = (child: ChildProfile) => {
    setSelectedChild(child);
    setShowChildDetail(true);
  };

  const handleRestrict = async () => {
    if (!selectedChild || !accessToken) return;

    try {
      const newStatus =
        selectedChild.status === "restreint"
          ? selectedChild.hasLoan
            ? "retour"
            : "possible"
          : "restreint";
      const formData = new FormData();
      formData.append("status", newStatus);
      await updateChildProfile(selectedChild._id, formData, accessToken);
      toast.success("Statut mis à jour");

      // Update the status in the state
      setSelectedChild((prevChild) =>
        prevChild ? { ...prevChild, status: newStatus } : null
      );
      setChildren((prevChildren) =>
        prevChildren.map((child) =>
          child._id === selectedChild._id
            ? { ...child, status: newStatus }
            : child
        )
      );
      setFilteredChildren((prevFiltered) =>
        prevFiltered.map((child) =>
          child._id === selectedChild._id
            ? { ...child, status: newStatus }
            : child
        )
      );
    } catch (error) {
      toast.error("Échec de la mise à jour du statut");
    }
  };

  const confirmDelete = async () => {
    try {
      if (!childToDelete || !accessToken) return;

      await deleteChildProfile(childToDelete._id, accessToken);
      toast.success("Profil supprimé avec succès");
      fetchChildren();
    } catch (error) {
      toast.error("Échec de la suppression du profil");
    } finally {
      setShowDeleteDialog(false);
      setChildToDelete(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "possible":
        return "bg-green-500";
      case "retour":
        return "bg-orange-500";
      case "restreint":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "possible":
        return "Emprunt possible";
      case "retour":
        return "En attente de retour";
      case "restreint":
        return "Restreint";
      default:
        return "Inconnu";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <Button onClick={() => setShowAddChild(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Ajouter
          </Button>
          <div className="flex-1 max-w-sm">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Rechercher par nom, prénom ou classe..."
            />
          </div>
        </div>
        {activeProject && (
          <div className="text-sm text-muted-foreground">
            Projet actif: {activeProject.nom} ({activeProject.annee})
          </div>
        )}
      </CardHeader>
      <CardContent>
        {/* Table pour mobile */}
        <div className="md:hidden">
          <ChildrenList
            children={filteredChildren}
            onSelectChild={handleSelectChild}
          />
        </div>
        {/* Table pour desktop */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Photo</TableHead>
                <TableHead>Prénom / Nom</TableHead>
                <TableHead>Classe</TableHead>
                <TableHead>Date de naissance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredChildren.map((child) => (
                <TableRow key={child._id}>
                  <TableCell>
                    <Avatar>
                      {child.photo ? (
                        <AvatarImage
                          src={`${API_URL}${child.photo}`}
                          alt={child.prenom}
                        />
                      ) : (
                        <AvatarFallback>
                          {child.prenom.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </TableCell>
                  <TableCell>{`${child.prenom} ${child.nom}`}</TableCell>
                  <TableCell>{child.classeSuivie}</TableCell>
                  <TableCell>
                    {new Date(child.dateNaissance).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div
                      className={`w-32 h-8 flex items-center justify-center text-sm font-medium text-white rounded text-center leading-tight ${getStatusColor(
                        child.status
                      )}`}
                      style={{ lineHeight: "1" }}
                    >
                      {getStatusText(child.status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewLoans(child)}
                          >
                            <BookOpen className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Voir les emprunts</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditChild(child)}
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
                            onClick={() => handleDeleteChild(child)}
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

      <AddChildDialog
        open={showAddChild}
        onOpenChange={setShowAddChild}
        onChildAdded={fetchChildren}
      />

      {selectedChild && (
        <>
          <EditChildDialog
            child={selectedChild}
            open={showEditChild}
            onOpenChange={setShowEditChild}
            onChildUpdated={fetchChildren}
          />
          <ChildLoansDialog
            child={selectedChild}
            open={showLoansDialog}
            onOpenChange={(open) => {
              if (!open) {
                handleLoansDialogClose(selectedChild._id);
              }
            }}
          />
        </>
      )}

      {showChildDetail && selectedChild && (
        <ChildDetailView
          child={selectedChild}
          onBack={() => setShowChildDetail(false)}
          onRestrict={handleRestrict}
          onLoan={() => setShowLoansDialog(true)}
          onEdit={() => {
            setShowEditChild(true);
            setShowChildDetail(false);
          }}
          onDelete={() => {
            handleDeleteChild(selectedChild);
            setShowChildDetail(false);
          }}
        />
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le profil sera définitivement
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