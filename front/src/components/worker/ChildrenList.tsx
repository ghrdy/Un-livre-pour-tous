import { ChildProfile } from "@/lib/api/children";
import { ChildCard } from "./ChildCard";

interface ChildrenListProps {
  children: ChildProfile[];
  onSelectChild: (child: ChildProfile) => void;
}

export function ChildrenList({ children, onSelectChild }: ChildrenListProps) {
  return (
    <div className="space-y-2">
      {children.map((child) => (
        <ChildCard
          key={child._id}
          child={child}
          onClick={() => onSelectChild(child)}
        />
      ))}
    </div>
  );
}
