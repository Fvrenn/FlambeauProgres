import React from "react";
import { Tabs, Tab, Card, CardBody, CardHeader, Divider, Button, Progress } from "@heroui/react";
import { Icon } from "@iconify/react";
import { fetchUsers, fetchBadgesComplete, fetchUserProgressById, User, ApiBadge } from "../../../services/api.service";
import { CompetenceList } from "./competence-list";
import { RealisationList } from "./realisation-list";

interface BadgeProgressProps {
  userId: string;
  selectedBadge: string | null;
  onSelectBadge: (badgeId: string) => void;
}

export const BadgeProgress: React.FC<BadgeProgressProps> = ({ 
  userId, 
  selectedBadge, 
  onSelectBadge 
}) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [badges, setBadges] = React.useState<ApiBadge[]>([]);
  const [userProgress, setUserProgress] = React.useState<Record<number, { isCompleted: boolean; completedAt: Date | null }>>({});
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [users, badgesData, progressData] = await Promise.all([
          fetchUsers(),
          fetchBadgesComplete(),
          fetchUserProgressById(parseInt(userId))
        ]);
        
        const foundUser = users.find(u => u.id.toString() === userId);
        setUser(foundUser || null);
        setBadges(badgesData);
        setUserProgress(progressData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur lors du chargement");
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      loadData();
    }
  }, [userId]);

  // Calculer la progression pour chaque badge
  const calculateBadgeProgress = (badge: ApiBadge) => {
    if (badge.competences.length === 0) return 0;
    
    const completedCompetences = badge.competences.filter(c => 
      userProgress[c.id]?.isCompleted
    ).length;
    
    return Math.round((completedCompetences / badge.competences.length) * 100);
  };

  // Déterminer si un badge est complété (toutes compétences validées)
  const isBadgeCompleted = (badge: ApiBadge) => {
    if (badge.competences.length === 0) return false;
    return badge.competences.every(c => userProgress[c.id]?.isCompleted);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin">
          <Icon icon="lucide:loader" className="text-2xl text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-danger">
        {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8 text-foreground-400">
        Utilisateur non trouvé
      </div>
    );
  }

  const handleBadgeSelect = (badgeId: string) => {
    onSelectBadge(badgeId);
  };

  const currentBadge = selectedBadge 
    ? badges.find(b => b.id.toString() === selectedBadge) 
    : null;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center mb-4">
        <h2 className="text-xl font-semibold">Progression de {user.name}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {badges.map(badge => {
          const progress = calculateBadgeProgress(badge);
          const isCompleted = isBadgeCompleted(badge);
          
          return (
            <Card 
              key={badge.id}
              isPressable
              isHoverable
              className={`border ${selectedBadge === badge.id.toString() ? 'border-primary' : 'border-divider'}`}
              onPress={() => handleBadgeSelect(badge.id.toString())}
            >
              <CardBody className="p-4">
                <div className="flex items-center mb-2">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                      isCompleted ? 'bg-success-100' : 'bg-default-100'
                    }`}
                  >
                    {badge.image_src ? (
                      <img 
                        src={badge.image_src} 
                        alt={badge.name}
                        className="w-8 h-8 object-contain"
                      />
                    ) : (
                      <Icon 
                        icon="lucide:award" 
                        className={`text-xl ${isCompleted ? 'text-success' : 'text-default-600'}`}
                      />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{badge.name}</p>
                    <p className="text-xs text-foreground-400">{badge.number}</p>
                    <div className="flex items-center">
                      {isCompleted ? (
                        <span className="text-xs flex items-center text-success">
                          <Icon icon="lucide:check-circle" className="mr-1" />
                          Compétences déclarées
                        </span>
                      ) : (
                        <span className="text-xs text-foreground-400">
                          {progress}% déclaré
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Progress 
                  size="sm" 
                  value={progress} 
                  color={isCompleted ? "success" : progress >= 75 ? "primary" : "default"}
                  className="mt-2"
                />
              </CardBody>
            </Card>
          );
        })}
      </div>

      {currentBadge && (
        <Card className="flex-1">
          <CardHeader className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 bg-default-100">
                {currentBadge.image_src ? (
                  <img 
                    src={currentBadge.image_src} 
                    alt={currentBadge.name}
                    className="w-6 h-6 object-contain"
                  />
                ) : (
                  <Icon icon="lucide:award" className="text-default-600" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-medium">{currentBadge.name}</h3>
                <p className="text-sm text-foreground-500">{currentBadge.number}</p>
              </div>
            </div>
            
            <BadgeValidationButton 
              userId={userId} 
              badgeId={currentBadge.id.toString()}
              badge={currentBadge}
              userProgress={userProgress}
            />
          </CardHeader>
          <Divider />
          <CardBody>
            <Tabs aria-label="Badge progress tabs">
              <Tab key="competences" title="Compétences">
                <CompetenceList 
                  userId={userId} 
                  badgeId={currentBadge.id.toString()} 
                />
              </Tab>
              <Tab key="realisations" title="Réalisations">
                <RealisationList 
                  userId={userId} 
                  badgeId={currentBadge.id.toString()} 
                />
              </Tab>
            </Tabs>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

interface BadgeValidationButtonProps {
  userId: string;
  badgeId: string;
  badge: ApiBadge;
  userProgress: Record<number, { isCompleted: boolean; completedAt: Date | null }>;
}

const BadgeValidationButton: React.FC<BadgeValidationButtonProps> = ({ 
  userId, 
  badgeId, 
  badge, 
  userProgress 
}) => {
  const [isValidating, setIsValidating] = React.useState(false);
  const [isValidated, setIsValidated] = React.useState(false);
  
  const canValidate = React.useMemo(() => {
    // Vérifier si toutes les compétences sont déclarées
    const allCompetencesCompleted = badge.competences.every(c => 
      userProgress[c.id]?.isCompleted
    );
    
    // Pour l'instant, on considère que les réalisations sont toujours validées
    // À adapter quand l'API des réalisations sera disponible
    const allRealisationsValidated = true;
    
    return allCompetencesCompleted && allRealisationsValidated && !isValidated;
  }, [badge.competences, userProgress, isValidated]);
  
  const handleValidation = async () => {
    setIsValidating(true);
    
    try {
      // TODO: Implémenter l'appel API pour valider un badge
      // await validateBadge(parseInt(userId), parseInt(badgeId));
      
      // Simulation pour l'instant
      setTimeout(() => {
        setIsValidated(true);
        setIsValidating(false);
      }, 1000);
    } catch (error) {
      console.error("Erreur lors de la validation du badge:", error);
      setIsValidating(false);
    }
  };
  
  if (isValidated) {
    return (
      <Button color="success" variant="flat" startContent={<Icon icon="lucide:check" />}>
        Badge validé
      </Button>
    );
  }
  
  return (
    <Button 
      color="primary" 
      isDisabled={!canValidate}
      isLoading={isValidating}
      onPress={handleValidation}
    >
      Valider le badge
    </Button>
  );
};