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
        <AvatarImage
          src={`${API_URL}${imageUrl}`}
          alt={name}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="12">${getInitials(
              name
            )}</text></svg>`;
          }}
        />
      ) : (
        <AvatarFallback>{getInitials(name)}</AvatarFallback>
      )}
    </Avatar>
  );
}
