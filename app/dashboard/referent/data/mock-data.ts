// Données fictives pour le développement

export const mockUsers = [
  {
    id: "user1",
    name: "Thomas Martin",
    avatar: "https://img.heroui.chat/image/avatar?w=150&h=150&u=1",
    progress: 68,
    completedBadges: 3,
    badges: [
      {
        badgeId: "badge1",
        progress: 100,
        isValidated: true,
        competences: [
          { competenceId: "comp1", isCompleted: true, isValidated: true, completedAt: "2023-10-15T14:30:00" },
          { competenceId: "comp2", isCompleted: true, isValidated: true, completedAt: "2023-10-16T09:45:00" },
          { competenceId: "comp3", isCompleted: true, isValidated: true, completedAt: "2023-10-17T16:20:00" }
        ],
        realisations: [
          { 
            id: "real1", 
            title: "Abri construit lors du camp d'été", 
            description: "Construction d'un abri en bois pour 6 personnes lors du camp d'été à Chamonix.",
            imageUrl: "https://img.heroui.chat/image/landscape?w=800&h=600&u=1", 
            submittedAt: "2023-10-18T11:30:00",
            isValidated: true 
          }
        ]
      },
      {
        badgeId: "badge2",
        progress: 75,
        isValidated: false,
        competences: [
          { competenceId: "comp4", isCompleted: true, isValidated: true, completedAt: "2023-11-05T10:15:00" },
          { competenceId: "comp5", isCompleted: true, isValidated: false, completedAt: "2023-11-10T14:20:00" },
          { competenceId: "comp6", isCompleted: false, isValidated: false, completedAt: null }
        ],
        realisations: [
          { 
            id: "real2", 
            title: "Carte topographique de la région", 
            description: "Création d'une carte topographique détaillée de la région de Grenoble avec points d'intérêt pour les activités en plein air.",
            imageUrl: "https://img.heroui.chat/image/landscape?w=800&h=600&u=2", 
            submittedAt: "2023-11-12T09:45:00",
            isValidated: true 
          },
          { 
            id: "real3", 
            title: "Organisation d'une randonnée", 
            description: "Planification et organisation d'une randonnée de 2 jours pour 15 personnes dans le massif des Écrins.",
            imageUrl: "https://img.heroui.chat/image/landscape?w=800&h=600&u=3", 
            submittedAt: "2023-11-20T16:30:00",
            isValidated: false 
          }
        ]
      },
      {
        badgeId: "badge3",
        progress: 30,
        isValidated: false,
        competences: [
          { competenceId: "comp7", isCompleted: true, isValidated: true, completedAt: "2023-12-03T11:20:00" },
          { competenceId: "comp8", isCompleted: false, isValidated: false, completedAt: null },
          { competenceId: "comp9", isCompleted: false, isValidated: false, completedAt: null }
        ],
        realisations: []
      }
    ]
  },
  {
    id: "user2",
    name: "Sophie Dubois",
    avatar: "https://img.heroui.chat/image/avatar?w=150&h=150&u=2",
    progress: 42,
    completedBadges: 2,
    badges: [
      {
        badgeId: "badge1",
        progress: 100,
        isValidated: true,
        competences: [
          { competenceId: "comp1", isCompleted: true, isValidated: true, completedAt: "2023-09-10T10:30:00" },
          { competenceId: "comp2", isCompleted: true, isValidated: true, completedAt: "2023-09-12T14:15:00" },
          { competenceId: "comp3", isCompleted: true, isValidated: true, completedAt: "2023-09-15T09:45:00" }
        ],
        realisations: [
          { 
            id: "real4", 
            title: "Construction d'un pont de singe", 
            description: "Réalisation d'un pont de singe lors du camp de printemps pour traverser un petit ruisseau.",
            imageUrl: "https://img.heroui.chat/image/landscape?w=800&h=600&u=4", 
            submittedAt: "2023-09-20T15:30:00",
            isValidated: true 
          }
        ]
      },
      {
        badgeId: "badge3",
        progress: 100,
        isValidated: true,
        competences: [
          { competenceId: "comp7", isCompleted: true, isValidated: true, completedAt: "2023-10-05T11:30:00" },
          { competenceId: "comp8", isCompleted: true, isValidated: true, completedAt: "2023-10-10T14:45:00" },
          { competenceId: "comp9", isCompleted: true, isValidated: true, completedAt: "2023-10-15T09:20:00" }
        ],
        realisations: [
          { 
            id: "real5", 
            title: "Atelier premiers secours", 
            description: "Organisation d'un atelier de formation aux premiers secours pour 20 jeunes.",
            imageUrl: "https://img.heroui.chat/image/landscape?w=800&h=600&u=5", 
            submittedAt: "2023-10-20T10:15:00",
            isValidated: true 
          }
        ]
      },
      {
        badgeId: "badge2",
        progress: 25,
        isValidated: false,
        competences: [
          { competenceId: "comp4", isCompleted: true, isValidated: false, completedAt: "2023-11-25T16:30:00" },
          { competenceId: "comp5", isCompleted: false, isValidated: false, completedAt: null },
          { competenceId: "comp6", isCompleted: false, isValidated: false, completedAt: null }
        ],
        realisations: []
      }
    ]
  },
  {
    id: "user3",
    name: "Lucas Bernard",
    avatar: "https://img.heroui.chat/image/avatar?w=150&h=150&u=3",
    progress: 85,
    completedBadges: 4,
    badges: [
      {
        badgeId: "badge1",
        progress: 100,
        isValidated: true,
        competences: [
          { competenceId: "comp1", isCompleted: true, isValidated: true, completedAt: "2023-08-05T09:30:00" },
          { competenceId: "comp2", isCompleted: true, isValidated: true, completedAt: "2023-08-10T14:15:00" },
          { competenceId: "comp3", isCompleted: true, isValidated: true, completedAt: "2023-08-15T11:45:00" }
        ],
        realisations: [
          { 
            id: "real6", 
            title: "Table de camp en bois", 
            description: "Construction d'une table de camp en bois pour 12 personnes avec bancs intégrés.",
            imageUrl: "https://img.heroui.chat/image/landscape?w=800&h=600&u=6", 
            submittedAt: "2023-08-20T15:30:00",
            isValidated: true 
          }
        ]
      },
      {
        badgeId: "badge2",
        progress: 100,
        isValidated: true,
        competences: [
          { competenceId: "comp4", isCompleted: true, isValidated: true, completedAt: "2023-09-05T10:30:00" },
          { competenceId: "comp5", isCompleted: true, isValidated: true, completedAt: "2023-09-10T14:45:00" },
          { competenceId: "comp6", isCompleted: true, isValidated: true, completedAt: "2023-09-15T09:20:00" }
        ],
        realisations: [
          { 
            id: "real7", 
            title: "Expédition en montagne", 
            description: "Organisation et conduite d'une expédition de 3 jours en montagne avec 10 participants.",
            imageUrl: "https://img.heroui.chat/image/landscape?w=800&h=600&u=7", 
            submittedAt: "2023-09-20T16:15:00",
            isValidated: true 
          }
        ]
      },
      {
        badgeId: "badge3",
        progress: 100,
        isValidated: true,
        competences: [
          { competenceId: "comp7", isCompleted: true, isValidated: true, completedAt: "2023-10-05T11:30:00" },
          { competenceId: "comp8", isCompleted: true, isValidated: true, completedAt: "2023-10-10T14:45:00" },
          { competenceId: "comp9", isCompleted: true, isValidated: true, completedAt: "2023-10-15T09:20:00" }
        ],
        realisations: [
          { 
            id: "real8", 
            title: "Formation secourisme", 
            description: "Animation d'une formation complète aux gestes de premiers secours pour 15 personnes.",
            imageUrl: "https://img.heroui.chat/image/landscape?w=800&h=600&u=8", 
            submittedAt: "2023-10-20T10:15:00",
            isValidated: true 
          }
        ]
      },
      {
        badgeId: "badge4",
        progress: 100,
        isValidated: true,
        competences: [
          { competenceId: "comp10", isCompleted: true, isValidated: true, completedAt: "2023-11-05T10:30:00" },
          { competenceId: "comp11", isCompleted: true, isValidated: true, completedAt: "2023-11-10T14:45:00" },
          { competenceId: "comp12", isCompleted: true, isValidated: true, completedAt: "2023-11-15T09:20:00" }
        ],
        realisations: [
          { 
            id: "real9", 
            title: "Projet environnemental", 
            description: "Organisation d'une campagne de nettoyage de la nature avec 30 participants et sensibilisation à l'écologie.",
            imageUrl: "https://img.heroui.chat/image/landscape?w=800&h=600&u=9", 
            submittedAt: "2023-11-20T15:30:00",
            isValidated: true 
          }
        ]
      },
      {
        badgeId: "badge5",
        progress: 25,
        isValidated: false,
        competences: [
          { competenceId: "comp13", isCompleted: true, isValidated: false, completedAt: "2023-12-05T11:30:00" },
          { competenceId: "comp14", isCompleted: false, isValidated: false, completedAt: null },
          { competenceId: "comp15", isCompleted: false, isValidated: false, completedAt: null }
        ],
        realisations: []
      }
    ]
  },
  {
    id: "user4",
    name: "Emma Petit",
    avatar: "https://img.heroui.chat/image/avatar?w=150&h=150&u=4",
    progress: 15,
    completedBadges: 0,
    badges: [
      {
        badgeId: "badge1",
        progress: 33,
        isValidated: false,
        competences: [
          { competenceId: "comp1", isCompleted: true, isValidated: false, completedAt: "2023-12-10T14:30:00" },
          { competenceId: "comp2", isCompleted: false, isValidated: false, completedAt: null },
          { competenceId: "comp3", isCompleted: false, isValidated: false, completedAt: null }
        ],
        realisations: []
      },
      {
        badgeId: "badge3",
        progress: 0,
        isValidated: false,
        competences: [
          { competenceId: "comp7", isCompleted: false, isValidated: false, completedAt: null },
          { competenceId: "comp8", isCompleted: false, isValidated: false, completedAt: null },
          { competenceId: "comp9", isCompleted: false, isValidated: false, completedAt: null }
        ],
        realisations: []
      }
    ]
  },
  {
    id: "user5",
    name: "Antoine Leroy",
    avatar: "https://img.heroui.chat/image/avatar?w=150&h=150&u=5",
    progress: 55,
    completedBadges: 2,
    badges: [
      {
        badgeId: "badge1",
        progress: 100,
        isValidated: true,
        competences: [
          { competenceId: "comp1", isCompleted: true, isValidated: true, completedAt: "2023-09-15T10:30:00" },
          { competenceId: "comp2", isCompleted: true, isValidated: true, completedAt: "2023-09-20T14:15:00" },
          { competenceId: "comp3", isCompleted: true, isValidated: true, completedAt: "2023-09-25T11:45:00" }
        ],
        realisations: [
          { 
            id: "real10", 
            title: "Cabane dans les arbres", 
            description: "Construction d'une cabane dans les arbres sécurisée pour les activités de groupe.",
            imageUrl: "https://img.heroui.chat/image/landscape?w=800&h=600&u=10", 
            submittedAt: "2023-09-30T15:30:00",
            isValidated: true 
          }
        ]
      },
      {
        badgeId: "badge4",
        progress: 100,
        isValidated: true,
        competences: [
          { competenceId: "comp10", isCompleted: true, isValidated: true, completedAt: "2023-10-15T10:30:00" },
          { competenceId: "comp11", isCompleted: true, isValidated: true, completedAt: "2023-10-20T14:45:00" },
          { competenceId: "comp12", isCompleted: true, isValidated: true, completedAt: "2023-10-25T09:20:00" }
        ],
        realisations: [
          { 
            id: "real11", 
            title: "Projet de sensibilisation", 
            description: "Organisation d'une journée de sensibilisation à la protection de l'environnement pour 50 personnes.",
            imageUrl: "https://img.heroui.chat/image/landscape?w=800&h=600&u=11", 
            submittedAt: "2023-10-30T16:15:00",
            isValidated: true 
          }
        ]
      },
      {
        badgeId: "badge2",
        progress: 66,
        isValidated: false,
        competences: [
          { competenceId: "comp4", isCompleted: true, isValidated: true, completedAt: "2023-11-15T11:30:00" },
          { competenceId: "comp5", isCompleted: true, isValidated: false, completedAt: "2023-11-20T14:45:00" },
          { competenceId: "comp6", isCompleted: false, isValidated: false, completedAt: null }
        ],
        realisations: [
          { 
            id: "real12", 
            title: "Parcours d'orientation", 
            description: "Création d'un parcours d'orientation avec 15 balises dans la forêt de Fontainebleau.",
            imageUrl: "https://img.heroui.chat/image/landscape?w=800&h=600&u=12", 
            submittedAt: "2023-11-25T10:15:00",
            isValidated: false 
          }
        ]
      }
    ]
  }
];

export const mockBadges = [
  {
    id: "badge1",
    name: "Construction",
    icon: "lucide:hammer",
    competences: [
      {
        id: "comp1",
        title: "Connaître les nœuds de base",
        description: "Maîtriser au moins 5 nœuds fondamentaux et savoir quand les utiliser."
      },
      {
        id: "comp2",
        title: "Construire une structure simple",
        description: "Être capable de construire une table, un banc ou une structure simple."
      },
      {
        id: "comp3",
        title: "Utiliser les outils en sécurité",
        description: "Démontrer l'utilisation sécuritaire des outils de base (scie, hache, etc.)."
      }
    ]
  },
  {
    id: "badge2",
    name: "Orientation",
    icon: "lucide:compass",
    competences: [
      {
        id: "comp4",
        title: "Lire une carte topographique",
        description: "Savoir interpréter les symboles et courbes de niveau d'une carte."
      },
      {
        id: "comp5",
        title: "Utiliser une boussole",
        description: "Être capable de s'orienter avec une boussole et de suivre un azimut."
      },
      {
        id: "comp6",
        title: "Organiser une course d'orientation",
        description: "Planifier et mettre en œuvre une activité d'orientation pour un groupe."
      }
    ]
  },
  {
    id: "badge3",
    name: "Secourisme",
    icon: "lucide:heart-pulse",
    competences: [
      {
        id: "comp7",
        title: "Gestes de premiers secours",
        description: "Connaître les gestes de base pour porter secours à une personne en danger."
      },
      {
        id: "comp8",
        title: "Réagir face à un accident",
        description: "Savoir évaluer une situation d'urgence et alerter les secours."
      },
      {
        id: "comp9",
        title: "Former aux premiers secours",
        description: "Être capable d'animer une session de formation aux premiers secours."
      }
    ]
  },
  {
    id: "badge4",
    name: "Environnement",
    icon: "lucide:leaf",
    competences: [
      {
        id: "comp10",
        title: "Connaître la faune et la flore",
        description: "Identifier au moins 20 espèces végétales et animales locales."
      },
      {
        id: "comp11",
        title: "Pratiquer le Leave No Trace",
        description: "Appliquer et enseigner les principes du 'Ne laissez aucune trace'."
      },
      {
        id: "comp12",
        title: "Organiser un projet environnemental",
        description: "Planifier et réaliser un projet de protection de l'environnement."
      }
    ]
  },
  {
    id: "badge5",
    name: "Animation",
    icon: "lucide:users",
    competences: [
      {
        id: "comp13",
        title: "Animer un jeu collectif",
        description: "Savoir expliquer et animer un jeu pour un groupe de jeunes."
      },
      {
        id: "comp14",
        title: "Gérer un temps spirituel",
        description: "Préparer et animer un temps de réflexion ou de prière adapté."
      },
      {
        id: "comp15",
        title: "Organiser une veillée",
        description: "Planifier et animer une veillée complète avec différentes activités."
      }
    ]
  }
];
