import React from "react";
import { Checkbox, Card, CardBody, Divider, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { 
  fetchBadgesComplete, 
  fetchUserProgressById, 
  validateCompetence, 
  invalidateCompetence,
  ApiBadge 
} from "../../../services/api.service";

interface CompetenceListProps {
  userId: string;
  badgeId: string;
}

export const CompetenceList: React.FC<CompetenceListProps> = ({ userId, badgeId }) => {
  const [competences, setCompetences] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  
  React.useEffect(() => {
    const loadCompetences = async () => {
      try {
        setIsLoading(true);
        const [badges, userProgress] = await Promise.all([
          fetchBadgesComplete(),
          fetchUserProgressById(parseInt(userId))
        ]);
        
        const badge = badges.find(b => b.id.toString() === badgeId);
        
        if (badge) {
          const competencesList = badge.competences.map(c => {
            const progress = userProgress[c.id];
            return {
              id: c.id.toString(),
              title: `Compétence ${c.id}`,
              description: c.description,
              isCompleted: progress?.isCompleted || false,
              isValidated: false, // TODO: À implémenter quand l'API sera disponible
              completedAt: progress?.completedAt || null
            };
          });
          
          setCompetences(competencesList);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des compétences:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCompetences();
  }, [userId, badgeId]);
  
  const handleValidation = async (competenceId: string, isValidated: boolean) => {
    try {
      if (isValidated) {
        await validateCompetence(parseInt(userId), parseInt(competenceId));
      } else {
        await invalidateCompetence(parseInt(userId), parseInt(competenceId));
      }
      
      setCompetences(prev => prev.map(c => 
        c.id === competenceId ? { ...c, isValidated } : c
      ));
    } catch (error) {
      console.error("Erreur lors de la validation de la compétence:", error);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin">
          <Icon icon="lucide:loader" className="text-2xl text-primary" />
        </div>
      </div>
    );
  }
  
  if (competences.length === 0) {
    return (
      <div className="text-center py-8 text-foreground-400">
        Aucune compétence trouvée pour ce badge
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {competences.map((competence) => (
        <Card key={competence.id} className="border border-divider">
          <CardBody className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium">{competence.title}</h4>
                <p className="text-sm text-foreground-500 mt-1">
                  {competence.description}
                </p>
                
                {competence.isCompleted && competence.completedAt && (
                  <div className="mt-2 flex items-center text-xs text-foreground-400">
                    <Icon icon="lucide:clock" className="mr-1" />
                    <span>
                      Déclaré le {new Date(competence.completedAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col items-end">
                <div className="flex items-center">
                  <Checkbox
                    isSelected={competence.isCompleted}
                    isReadOnly
                    color="default"
                    className="mr-2"
                  >
                    <span className="text-sm">Déclaré</span>
                  </Checkbox>
                </div>
                
                <Divider className="my-2" />
                
                <div className="flex items-center">
                  {competence.isValidated ? (
                    <Button
                      size="sm"
                      color="danger"
                      variant="flat"
                      onPress={() => handleValidation(competence.id, false)}
                      startContent={<Icon icon="lucide:x" />}
                    >
                      Invalider
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      color="success"
                      variant="flat"
                      isDisabled={!competence.isCompleted}
                      onPress={() => handleValidation(competence.id, true)}
                      startContent={<Icon icon="lucide:check" />}
                    >
                      Valider
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};