// filepath: /Users/timhrdy/Documents/dev/ARASOFT/old/bib/front/src/pages/SettingsPage.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserManagement from "@/components/admin/UserManagement";
import ProjectManagement from "@/components/admin/ProjectManagement";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ModeToggle } from "@/components/mode-toggle";
import "@/index.css"; // Assurez-vous que le chemin est correct
import { API_URL } from "@/lib/api/config";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}users/logout`, {
        method: "POST",
        credentials: "include",
      });
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground">
          {user?.role === "admin"
            ? "Gérer les utilisateurs et les projets"
            : "Gérer vos préférences"}
        </p>
      </div>

      {/* User Info and Settings Section - Visible to all users */}
      <div className="space-y-4">
        <div className="p-4 bg-card rounded-lg border profile-section">
          <h2 className="font-semibold mb-2">Profil</h2>
          <div className="space-y-1">
            <p>{`${user?.prenom} ${user?.nom}`}</p>
            <p className="text-sm text-muted-foreground">
              {user ? getRoleDisplay(user.role) : ""}
            </p>
          </div>
          <div className="flex space-x-4 mt-4">
            <Button onClick={handleLogout} className="w-1/2 logout-button">
              <LogOut className="mr-2 h-4 w-4" />
              Se déconnecter
            </Button>
          </div>
        </div>

        <div className="p-4 bg-card rounded-lg border space-y-4 preferences-section">
          <h2 className="font-semibold mb-2">Préférences</h2>
          <div className="flex items-center justify-between">
            <span>Thème</span>
            <ModeToggle />
          </div>
        </div>
      </div>

      {/* Admin Section - Only visible to admin users */}
      {user?.role === "admin" && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Administration</h2>
          <Tabs defaultValue="users" className="space-y-4">
            <TabsList>
              <TabsTrigger value="users">Utilisateurs</TabsTrigger>
              <TabsTrigger value="projects">Projets</TabsTrigger>
            </TabsList>
            <TabsContent value="users" className="space-y-4">
              <UserManagement />
            </TabsContent>
            <TabsContent value="projects" className="space-y-4">
              <ProjectManagement />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
