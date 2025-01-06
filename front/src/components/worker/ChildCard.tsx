import { ChildProfile } from "@/lib/api/children";
import { ProfileAvatar } from "@/components/ui/profile-avatar";
import { ChevronRight } from "lucide-react";

interface ChildCardProps {
  child: ChildProfile;
  onClick: () => void;
}

export function ChildCard({ child, onClick }: ChildCardProps) {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "possible":
        return "bg-green-100 text-green-800";
      case "retour":
        return "bg-orange-100 text-orange-800";
      case "restreint":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
    <div
      onClick={onClick}
      className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border cursor-pointer active:bg-gray-50"
    >
      <ProfileAvatar
        imageUrl={child.photo}
        name={`${child.prenom} ${child.nom}`}
        size="lg"
      />

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold truncate">
          {child.prenom} {child.nom}
        </h3>
        <p className="text-sm text-muted-foreground">{child.classeSuivie}</p>
        <div
          className={`inline-block px-2 py-1 mt-1 text-xs font-medium rounded-full ${getStatusStyle(
            child.status
          )}`}
        >
          {getStatusText(child.status)}
        </div>
      </div>

      <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
    </div>
  );
}
