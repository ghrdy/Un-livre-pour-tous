import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ChildrenManagement from "@/components/worker/ChildrenManagement";
import { useModalStore } from "@/lib/stores/modalStore";

export default function ChildrenPage() {
  const [searchParams] = useSearchParams();
  const setShowAddChild = useModalStore((state) => state.setShowAddChild);

  useEffect(() => {
    if (searchParams.get("action") === "add") {
      setShowAddChild(true);
    }
  }, [searchParams, setShowAddChild]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Enfants</h1>
        <p className="text-muted-foreground">Gérer les profils des enfants</p>
      </div>
      <ChildrenManagement />
    </div>
  );
}
