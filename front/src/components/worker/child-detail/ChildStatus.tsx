interface ChildStatusProps {
  status: string;
}

export function ChildStatus({ status }: ChildStatusProps) {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "possible":
        return "bg-green-100 text-green-800 border-green-200";
      case "retour":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "restreint":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "possible":
        return "Emprunt possible";
      case "retour":
        return "En attente de retour";
      case "restreint":
        return "Restreint";
      default:
        return "Inconnu";
    }
  };

  return (
    <div
      className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusStyle(
        status
      )}`}
    >
      {getStatusText(status)}
    </div>
  );
}
