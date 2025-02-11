import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { API_URL } from "@/lib/api/config";
import Logo from "../assets/Logo.svg?react";
import Eye from "../assets/Eye.svg?react";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Connexion échouée");
      }

      const data = await response.json();

      // Extract user info from JWT token
      const tokenPayload = JSON.parse(atob(data.token.split(".")[1]));

      const user = {
        id: tokenPayload.id,
        nom: tokenPayload.nom,
        prenom: tokenPayload.prenom,
        role: tokenPayload.role,
      };

      login(user, data.token, data.reftoken);
      toast.success("Connexion réussie");
      navigate("/");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur est survenue");
      }
      toast.error("Connexion échouée!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex overflow-hidden flex-col items-center px-4 pb-5 pt-10 w-full bg-white"
    >
      <Logo className="object-contain w-24 aspect-square" />
      <h1 className="mt-8 text-2xl font-semibold text-center text-slate-950">
        Connectez vous
      </h1>
      <div className="flex flex-col items-start mt-8 w-80 max-w-full text-base text-slate-500">
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="mb-3 w-full"
        />

        <div className="relative mb-3 w-full">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Mot de passe"
            className="w-full"
          />
          <Eye
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          />
        </div>
        <div className="flex justify-end w-full">
          <a href="/forgot-password" className="text-blue-500 hover:underline">
            Mot de passe oublié ?
          </a>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex justify-center ">
        <Button
          type="submit"
          variant="custom"
          className="custom-button-width3"
          style={{ marginTop: "32px", marginBottom: "32px" }}
        >
          Se connecter
        </Button>
      </div>

      <h3 className="text-l">Vous n'avez pas d'acces ?</h3>
      <div className="flex justify-end mt-1">
        <a href="/request-access" className="text-blue-500 hover:underline">
          Demander un accès
        </a>
      </div>
    </form>
  );
}
