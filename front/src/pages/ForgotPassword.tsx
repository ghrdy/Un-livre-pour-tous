import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { toast } from "sonner";
import { API_URL } from "@/lib/api/config";
import Logo from "../assets/Logo.svg?react";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleResetPassword = async () => {
    setError("");
    try {
      const response = await fetch(`${API_URL}/users/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to reset password");
      }

      toast.success("Password reset email sent successfully");
      navigate("/login");
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <Logo className="inline-block h-22 w-22 mb-2" />
      <div className="text-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-900">
          Mot de passe oublié
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Saisissez l'adresse email pour recevoir un email de réinitialisation
          de votre mot de passe.
        </p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleResetPassword();
        }}
        className="space-y-4 w-full max-w-md"
      >
        <div className="space-y-2">
          <div className="flex flex-col items-center mt-8 w-full text-base text-slate-500">
            <Input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              required
              placeholder="Adresse email"
              className="w-full mb-8"
            />
          </div>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="flex flex-col items-center font-bold whitespace-nowrap">
          <Button
            type="submit"
            variant="custom"
            className="custom-button-width2"
          >
            Réinitialiser
          </Button>
          <a href="/login" className="mt-3 text-blue-500 hover:underline">
            Retour
          </a>
        </div>
      </form>
    </div>
  );
}
