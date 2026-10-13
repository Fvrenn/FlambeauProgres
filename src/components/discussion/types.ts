import type { TypeObjectif } from "@prisma/client";
import type { MessageType } from "@prisma/client";

export type ThreadAuthor = {
  id: string;
  name: string;
  image: string | null;
};

export type ThreadFile = {
  id: string;
  nomOriginal: string;
  mimeType: string;
};

export type UiMessage = {
  id: string;
  auteurId: string;
  contenu: string | null;
  type: MessageType;
  createdAt: Date;
  auteur: ThreadAuthor;
  fichier: ThreadFile | null;
  pending?: boolean;
};

export type ThreadObjectif = {
  code: string;
  description: string;
  type: TypeObjectif;
};

export const CLASSES_MODALE_DISCUSSION =
  "m-0 h-[100dvh] max-h-[100dvh] rounded-none bg-dashboard sm:mx-6 sm:my-16 sm:h-[80vh] sm:max-h-[80vh] sm:rounded-large";
