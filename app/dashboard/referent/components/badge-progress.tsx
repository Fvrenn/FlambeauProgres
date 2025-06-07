import React from "react";
import { Tabs, Tab, Card, CardBody, CardHeader, Divider, Button, Progress } from "@heroui/react";
import { Icon } from "@iconify/react";
import { mockUsers, mockBadges } from "../data/mock-data";
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
  const user = mockUsers.find(u => u.id === userId);
  
  if (!user) {
    return <div>Utilisateur non trouvé</div>;
  }

  const handleBadgeSelect = (badgeId: string) => {
    onSelectBadge(badgeId);
  };

  const currentBadge = selectedBadge 
    ? mockBadges.find(b => b.id === selectedBadge) 
    : null;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center mb-4">
        <h2 className="text-xl font-semibold">Progression de {user.name}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {mockBadges.map(badge => {
          const userBadge = user.badges.find(b => b.badgeId === badge.id);
          const progress = userBadge?.progress || 0;
          const isCompleted = userBadge?.isValidated || false;
          
          return (
            <Card 
              key={badge.id}
              isPressable
              isHoverable
              className={`border ${selectedBadge === badge.id ? 'border-primary' : 'border-divider'}`}
              onPress={() => handleBadgeSelect(badge.id)}
            >
              <CardBody className="p-4">
                <div className="flex items-center mb-2">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                      isCompleted ? 'bg-success-100' : 'bg-default-100'
                    }`}
                  >
                    <Icon 
                      icon={badge.icon} 
                      className={`text-xl ${isCompleted ? 'text-success' : 'text-default-600'}`}
                    />
                  </div>
                  <div>
                    <p className="font-medium">{badge.name}</p>
                    <div className="flex items-center">
                      {isCompleted ? (
                        <span className="text-xs flex items-center text-success">
                          <Icon icon="lucide:check-circle" className="mr-1" />
                          Validé
                        </span>
                      ) : (
                        <span className="text-xs text-foreground-400">
                          {progress}% complété
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
                <Icon icon={currentBadge.icon} className="text-default-600" />
              </div>
              <h3 className="text-lg font-medium">{currentBadge.name}</h3>
            </div>
            
            <BadgeValidationButton 
              userId={userId} 
              badgeId={currentBadge.id}
            />
          </CardHeader>
          <Divider />
          <CardBody>
            <Tabs aria-label="Badge progress tabs">
              <Tab key="competences" title="Compétences">
                <CompetenceList 
                  userId={userId} 
                  badgeId={currentBadge.id} 
                />
              </Tab>
              <Tab key="realisations" title="Réalisations">
                <RealisationList 
                  userId={userId} 
                  badgeId={currentBadge.id} 
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
}

const BadgeValidationButton: React.FC<BadgeValidationButtonProps> = ({ userId, badgeId }) => {
  const [isValidating, setIsValidating] = React.useState(false);
  const [isValidated, setIsValidated] = React.useState(false);
  
  const user = mockUsers.find(u => u.id === userId);
  const userBadge = user?.badges.find(b => b.badgeId === badgeId);
  
  const canValidate = React.useMemo(() => {
    if (!userBadge) return false;
    
    // Check if all competences are validated
    const allCompetencesValidated = userBadge.competences.every(c => c.isValidated);
    
    // Check if all realisations are validated
    const allRealisationsValidated = userBadge.realisations.every(r => r.isValidated);
    
    return allCompetencesValidated && allRealisationsValidated && !userBadge.isValidated;
  }, [userBadge]);
  
  React.useEffect(() => {
    if (userBadge) {
      setIsValidated(userBadge.isValidated);
    }
  }, [userBadge]);
  
  const handleValidation = () => {
    setIsValidating(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsValidated(true);
      setIsValidating(false);
    }, 1000);
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