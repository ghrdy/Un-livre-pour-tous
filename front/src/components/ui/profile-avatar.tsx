import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { API_URL } from "@/lib/api/config";

interface ProfileAvatarProps {
  imageUrl: string | null;
  name: string;
  size?: "default" | "lg";
  className?: string;
}

export function ProfileAvatar({
  imageUrl,
  name,
  size = "default",
  className = "",
}: ProfileAvatarProps) {
  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const sizeClasses = {
    default: "h-10 w-10",
    lg: "h-20 w-20",
  };

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      {imageUrl ? (
        <AvatarImage src={`${API_URL}${imageUrl}`} alt={name} />
      ) : (
        <AvatarFallback>{getInitials(name)}</AvatarFallback>
      )}
    </Avatar>
  );
}
