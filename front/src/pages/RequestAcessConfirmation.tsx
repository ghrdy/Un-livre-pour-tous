import CheckCircle from "../assets/CheckCircle.svg?react";

export default function AccessRequestPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="flex flex-col items-center text-center max-w-[375px] w-full bg-white p-5 rounded-md">
        <CheckCircle className="object-contain w-24 aspect-square" />
        <h1 className="mt-3 text-2xl font-semibold text-slate-950">
          Accès demandés
        </h1>
        <p className=" mt-3 text-sm leading-5 text-slate-500">
          Votre demande a été envoyée à l'administrateur.
          <br />
          Vous recevrez une notification de sa décision à l'adresse email
          renseignée précédemment.
        </p>
      </div>
    </div>
  );
}
