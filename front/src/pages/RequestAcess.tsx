import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { API_URL } from "@/lib/api/config";
import Eye from "../assets/Eye.svg?react";

export default function RequestAcess() {
  const navigate = useNavigate();
  const [nom, setNom] = useState<string>("");
  const [prenom, setPrenom] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users/request-access`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nom, prenom, email, password, note }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Échec de la demande d'accès");
      }

      toast.success("Demande d'accès envoyée avec succès");
      navigate("/login");
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex overflow-hidden flex-col items-center px-4 pt-11 pb-5 w-full bg-white"
    >
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/843e94badbe37ea228d302851b473ed9c4666e05bbab1b7775efa0a2208a4334?placeholderIfAbsent=true&apiKey=00033926861842f2a59f2f6802cccc90"
        alt=""
        className="object-contain w-24 aspect-square"
      />
      <h1 className="mt-8 text-2xl font-semibold text-center text-slate-950">
        Demandez un accès
      </h1>
      <div className="flex flex-col items-start mt-8 w-80 max-w-full text-base text-slate-500">
        <Input
          id="nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          className="mt-1 mb-3 w-full"
          placeholder="Nom"
          aria-label="Nom"
          required
        />
        <Input
          id="prenom"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          className="mt-1 mb-3 w-full"
          placeholder="Prénom"
          aria-label="Prénom"
          required
        />
        <Input
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 mb-3 w-full"
          placeholder="Email"
          aria-label="Email"
          required
        />
        <div className="relative mt-1 mb-3 w-full">
          <Input
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            aria-label="Mot de passe"
            type={showPassword ? "text" : "password"}
            className="w-full"
            required
          />
          <Eye
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          />
        </div>
        <div className="relative mt-1 mb-3 w-full">
          <Input
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirmer le mot de passe"
            aria-label="Confirmer le mot de passe"
            type={showConfirmPassword ? "text" : "password"}
            className="w-full"
            required
          />
          <Eye
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          />
        </div>
      </div>
      <div className="flex flex-col mt-8 w-80 max-w-full text-base">
        <label htmlFor="note" className="font-semibold text-slate-950">
          Note à l'admnistrateur (optionnel)
        </label>
        <input
          id="note"
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="flex-1 shrink self-stretch px-3 py-2 mt-3 w-full whitespace-nowrap bg-white rounded-lg border border-solid border-slate-200 text-slate-500"
          placeholder="Note"
          aria-label="Note à l'admnistrateur (optionnel)"
        />
      </div>
      {error && <p className="mt-4 text-red-500">{error}</p>}
      <div className="flex flex-col items-center mt-8 font-bold whitespace-nowrap">
        <Button type="submit">Demander</Button>
        <Button type="button" onClick={() => navigate("/")}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
