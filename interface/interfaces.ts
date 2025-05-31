export interface Competence {
  id: string;
  description: string;
  isCompleted: boolean;
  files?: File[];
}

export interface Realisations {
  id: string;
  description: string;
  isCompleted: boolean;
  files?: File[];
}

export interface Badge {
  id: string;
  name: string;
  number: string;
  description: string;
  image_src: string;
  competences: Competence[];
  realisations: Realisations[];
}
