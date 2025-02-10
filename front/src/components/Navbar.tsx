/// <reference types="vite-plugin-svgr/client" />
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import HouseIcon from "../assets/House.svg?react";
import BooksIcon from "../assets/Books.svg?react";
import UsersIcon from "../assets/UsersThree.svg?react";
import GearIcon from "../assets/Gear.svg?react";
import { API_URL } from "@/lib/api/config";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/users/logout`, {
        method: "POST",
        credentials: "include",
      });
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isActive = (path: string) => location.pathname === path;

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
    <>
      {/* Desktop Navigation */}
      <nav className="border-b hidden md:block">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button
                  variant="ghost"
                  className={`flex items-center space-x-2 ${
                    isActive("/") ? "navbar-button-selected" : ""
                  }`}
                >
                  <HouseIcon className="h-4 w-4" />
                  <span>Accueil</span>
                </Button>
              </Link>
              {isAuthenticated && (
                <>
                  <Link to="/children">
                    <Button
                      variant="ghost"
                      className={`flex items-center space-x-2 ${
                        isActive("/children") ? "navbar-button-selected" : ""
                      }`}
                    >
                      <UsersIcon className="h-4 w-4" />
                      <span>Enfants</span>
                    </Button>
                  </Link>
                  <Link to="/books">
                    <Button
                      variant="ghost"
                      className={`flex items-center space-x-2 ${
                        isActive("/books") ? "navbar-button-selected" : ""
                      }`}
                    >
                      <BooksIcon className="h-4 w-4" />
                      <span>Livres</span>
                    </Button>
                  </Link>
                  {user?.role === "admin" && (
                    <Link to="/settings">
                      <Button
                        variant="ghost"
                        className={`flex items-center space-x-2 ${
                          isActive("/settings") ? "navbar-button-selected" : ""
                        }`}
                      >
                        <GearIcon className="h-4 w-4" />
                        <span>Plus</span>
                      </Button>
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ModeToggle />
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {user && (
                  <div className="text-right">
                    <p className="text-sm font-medium">{`${user.prenom} ${user.nom}`}</p>
                    <p className="text-xs text-muted-foreground">
                      {getRoleDisplay(user.role)}
                    </p>
                  </div>
                )}
                <Button onClick={handleLogout} variant="ghost" size="icon">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="custom">Connexion</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t z-50">
        <div className="flex justify-around items-center h-20 px-2">
          <Link to="/" className="flex flex-col items-center">
            <Button
              variant="ghost"
              size="icon"
              className={isActive("/") ? "navbar-button-selected" : ""}
            >
              <HouseIcon className="h-5 w-5" />
            </Button>
            <span className="text-xs mt-1">Accueil</span>
          </Link>
          {isAuthenticated && (
            <>
              <Link to="/children" className="flex flex-col items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className={
                    isActive("/children") ? "navbar-button-selected" : ""
                  }
                >
                  <UsersIcon className="h-5 w-5" />
                </Button>
                <span className="text-xs mt-1">Enfants</span>
              </Link>
              <Link to="/books" className="flex flex-col items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className={isActive("/books") ? "navbar-button-selected" : ""}
                >
                  <BooksIcon className="h-5 w-5" />
                </Button>
                <span className="text-xs mt-1">Livres</span>
              </Link>
              <Link to="/settings" className="flex flex-col items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className={
                    isActive("/settings") ? "navbar-button-selected" : ""
                  }
                >
                  <GearIcon className="h-5 w-5" />
                </Button>
                <span className="text-xs mt-1">Plus</span>
              </Link>
            </>
          )}
          {!isAuthenticated && (
            <Link to="/login" className="flex flex-col items-center">
              <Button variant="custom" size="icon">
                <LogOut className="h-5 w-5" />
              </Button>
              <span className="text-xs mt-1">Connexion</span>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}
