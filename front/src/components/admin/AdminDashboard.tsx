import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, FolderGit2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { API_URL } from "@/lib/api/config";

interface Stats {
  users: number;
  books: number;
  projects: number;
  activeLoans: number;
}

export function AdminDashboard() {
  const { accessToken } = useAuth();
  const [stats, setStats] = useState<Stats>({
    users: 0,
    books: 0,
    projects: 0,
    activeLoans: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [users, books, projects, loans] = await Promise.all([
          fetch(`${API_URL}/users`, {
            headers: { Cookie: `accessToken=${accessToken}` },
            credentials: "include",
          }).then((res) => res.json()),
          fetch(`${API_URL}/books`, {
            headers: { Cookie: `accessToken=${accessToken}` },
            credentials: "include",
          }).then((res) => res.json()),
          fetch(`${API_URL}/projects`, {
            headers: { Cookie: `accessToken=${accessToken}` },
            credentials: "include",
          }).then((res) => res.json()),
          fetch(`${API_URL}/bookLoans`, {
            headers: { Cookie: `accessToken=${accessToken}` },
            credentials: "include",
          }).then((res) => res.json()),
        ]);

        setStats({
          users: users.length,
          books: books.length,
          projects: projects.length,
          activeLoans: loans.length,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    fetchStats();
  }, [accessToken]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Tableau de bord</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users}</div>
            <p className="text-xs text-muted-foreground">
              Utilisateurs inscrits
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
              Livres dans la bibliothèque
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
            <p className="text-xs text-muted-foreground">Emprunts en cours</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
