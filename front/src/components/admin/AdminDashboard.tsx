import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, FolderGit2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { API_URL } from "@/lib/api/config";
import { useProjectStore } from "@/lib/stores/projectStore";

interface Stats {
  users: number;
  books: number;
  projects: number;
  activeLoans: number;
}

interface User {
  _id: string;
  projet: string | null;
}

export function AdminDashboard() {
  const { accessToken } = useAuth();
  const { activeProject } = useProjectStore();
  const [stats, setStats] = useState<Stats>({
    users: 0,
    books: 0,
    projects: 0,
    activeLoans: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!accessToken) return;

        // Base URLs for fetching data
        let usersUrl = `${API_URL}/users`;
        let booksUrl = `${API_URL}/books`;
        let projectsUrl = `${API_URL}/projects`;
        let loansUrl = `${API_URL}/bookLoans`;

        // If a project is selected, modify URLs to fetch project-specific data
        if (activeProject) {
          booksUrl = `${API_URL}/projects/${activeProject._id}/books`;
          // Don't modify the loans URL for project-specific data since the endpoint doesn't exist
        }

        const [users, books, projects, loans] = await Promise.all([
          fetch(usersUrl, {
            headers: { Cookie: `accessToken=${accessToken}` },
            credentials: "include",
          }).then((res) => res.json()),
          fetch(booksUrl, {
            headers: { Cookie: `accessToken=${accessToken}` },
            credentials: "include",
          }).then((res) => res.json()),
          fetch(projectsUrl, {
            headers: { Cookie: `accessToken=${accessToken}` },
            credentials: "include",
          }).then((res) => res.json()),
          fetch(loansUrl, {
            headers: { Cookie: `accessToken=${accessToken}` },
            credentials: "include",
          })
            .then((res) => res.json())
            .catch(() => []),
        ]);

        // Filter users if a project is selected
        const filteredUsers = activeProject
          ? users.filter((user: User) => user.projet === activeProject._id)
          : users;

        // Filter loans if a project is selected
        const filteredLoans =
          activeProject && Array.isArray(loans) ? loans : loans;

        setStats({
          users: filteredUsers.length,
          books: Array.isArray(books) ? books.length : 0,
          projects: projects.length,
          activeLoans: Array.isArray(filteredLoans) ? filteredLoans.length : 0,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    fetchStats();
  }, [accessToken, activeProject]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Tableau de bord</h2>
      {activeProject && (
        <div className="text-lg font-medium">
          Projet actif: {activeProject.nom} ({activeProject.annee})
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users}</div>
            <p className="text-xs text-muted-foreground">
              {activeProject
                ? "Utilisateurs associés"
                : "Utilisateurs inscrits"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Livres</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.books}</div>
            <p className="text-xs text-muted-foreground">
              {activeProject
                ? "Livres dans le projet"
                : "Livres dans la bibliothèque"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projets</CardTitle>
            <FolderGit2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.projects}</div>
            <p className="text-xs text-muted-foreground">Projets actifs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emprunts</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeLoans}</div>
            <p className="text-xs text-muted-foreground">
              {activeProject ? "Emprunts dans le projet" : "Emprunts en cours"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
