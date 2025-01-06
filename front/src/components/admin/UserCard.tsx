import { User } from "@/lib/api/users";
import { ProfileAvatar } from "@/components/ui/profile-avatar";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface UserCardProps {
  user: User;
  onClick: () => void;
}

export function UserCard({ user, onClick }: UserCardProps) {
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
    <div
      onClick={onClick}
      className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border cursor-pointer active:bg-gray-50"
    >
      <ProfileAvatar
        imageUrl={null}
        name={`${user.prenom} ${user.nom}`}
        size="lg"
      />

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold truncate">
          {user.prenom} {user.nom}
        </h3>
        <p className="text-sm text-muted-foreground">{user.email}</p>
        <p className="text-sm text-muted-foreground">
          {getRoleDisplay(user.role)}
        </p>
        <div className="mt-1">
          {!user.validated && (
            <Badge
              variant="secondary"
              className="bg-yellow-100 text-yellow-800"
            >
              En attente de validation
            </Badge>
          )}
          {user.validated && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Validé
            </Badge>
          )}
        </div>
      </div>

      <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
    </div>
  );
}
