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
};
