import { User } from "@/lib/api/users";
import { UserCard } from "./UserCard";

interface UsersListProps {
  users: User[];
  onSelectUser: (user: User) => void;
}

export function UsersList({ users, onSelectUser }: UsersListProps) {
  return (
    <div className="space-y-2">
      {users.map((user) => (
        <UserCard
          key={user._id}
          user={user}
          onClick={() => onSelectUser(user)}
        />
      ))}
    </div>
  );
}
