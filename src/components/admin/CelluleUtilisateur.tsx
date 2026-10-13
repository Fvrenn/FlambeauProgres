import { Avatar } from "@/components/ui";

type CelluleUtilisateurProps = {
  utilisateur: { name: string; email: string; image?: string | null };
};

export function CelluleUtilisateur({ utilisateur }: CelluleUtilisateurProps) {
  return (
    <div className="flex items-center gap-3">
      <Avatar name={utilisateur.name} size="sm" src={utilisateur.image} />
      <div className="flex flex-col">
        <p className="text-bold text-small">{utilisateur.name}</p>
        <p className="text-bold text-tiny text-default-400">
          {utilisateur.email}
        </p>
      </div>
    </div>
  );
}
