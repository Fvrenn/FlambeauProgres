import React from "react";
import { Card, CardBody, CardFooter, Button, Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from "@heroui/react";
import { Icon } from "@iconify/react";
import { fetchBadgesComplete } from "../../../services/api.service";

interface RealisationListProps {
  userId: string;
  badgeId: string;
}

export const RealisationList: React.FC<RealisationListProps> = ({ userId, badgeId }) => {
  const [realisations, setRealisations] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedRealisation, setSelectedRealisation] = React.useState<any>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  
  React.useEffect(() => {
    const loadRealisations = async () => {
      try {
        setIsLoading(true);
        const badges = await fetchBadgesComplete();
        const badge = badges.find(b => b.id.toString() === badgeId);
        
        if (badge) {
          // Utiliser les vraies réalisations de l'API
          const realisationsList = badge.realisations.map(r => ({
            id: r.id.toString(),
            title: `Réalisation ${r.id}`,
            description: r.description,
            submittedAt: new Date().toISOString(), // Pour l'instant, date fictive
            isValidated: false
          }));
          
          setRealisations(realisationsList);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des réalisations:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadRealisations();
  }, [userId, badgeId]);
  
  const handleValidation = (realisationId: string, isValidated: boolean) => {
    setRealisations(prev => prev.map(r => 
      r.id === realisationId ? { ...r, isValidated } : r
    ));
    
    if (selectedRealisation?.id === realisationId) {
      setSelectedRealisation(prev => ({ ...prev, isValidated }));
    }
  };
  
  const handleViewRealisation = (realisation: any) => {
    setSelectedRealisation(realisation);
    onOpen();
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
  
  if (realisations.length === 0) {
    return (
      <div className="text-center py-8 text-foreground-400">
        <Icon icon="lucide:clipboard-list" className="text-4xl mb-2 mx-auto" />
        <p>Aucune réalisation définie pour ce badge</p>
      </div>
    );
  }
  
  return (
    <>
      <div className="space-y-4">
        {realisations.map((realisation) => (
          <Card key={realisation.id} className="border border-divider">
            <CardBody className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <Icon icon="lucide:file-text" className="text-lg text-default-500 mr-2" />
                    <h4 className="font-medium">{realisation.title}</h4>
                    {realisation.isValidated && (
                      <Icon icon="lucide:check-circle" className="text-success ml-2" />
                    )}
                  </div>
                  <p className="text-foreground-600 text-sm mb-2">{realisation.description}</p>
                  <p className="text-foreground-400 text-xs">
                    Soumis le {new Date(realisation.submittedAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            </CardBody>
            <CardFooter className="flex justify-between pt-0">
              <Button
                size="sm"
                variant="flat"
                onPress={() => handleViewRealisation(realisation)}
                startContent={<Icon icon="lucide:eye" />}
              >
                Voir détails
              </Button>
              
              {realisation.isValidated ? (
                <Button
                  size="sm"
                  color="danger"
                  variant="flat"
                  onPress={() => handleValidation(realisation.id, false)}
                  startContent={<Icon icon="lucide:x" />}
                >
                  Invalider
                </Button>
              ) : (
                <Button
                  size="sm"
                  color="success"
                  variant="flat"
                  onPress={() => handleValidation(realisation.id, true)}
                  startContent={<Icon icon="lucide:check" />}
                >
                  Valider
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center">
                  <Icon icon="lucide:file-text" className="text-lg mr-2" />
                  {selectedRealisation?.title}
                </div>
              </ModalHeader>
              <ModalBody className="pb-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-foreground-600">{selectedRealisation?.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Informations</h4>
                    <p className="text-sm text-foreground-500">
                      Soumis le {selectedRealisation?.submittedAt && new Date(selectedRealisation.submittedAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    <p className="text-sm text-foreground-500">
                      Statut: <span className={selectedRealisation?.isValidated ? 'text-success' : 'text-warning'}>
                        {selectedRealisation?.isValidated ? 'Validé' : 'En attente de validation'}
                      </span>
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-between mt-6">
                  <Button
                    color="default"
                    variant="flat"
                    onPress={onClose}
                  >
                    Fermer
                  </Button>
                  
                  {selectedRealisation?.isValidated ? (
                    <Button
                      color="danger"
                      variant="flat"
                      onPress={() => handleValidation(selectedRealisation.id, false)}
                      startContent={<Icon icon="lucide:x" />}
                    >
                      Invalider cette réalisation
                    </Button>
                  ) : (
                    <Button
                      color="success"
                      variant="flat"
                      onPress={() => handleValidation(selectedRealisation.id, true)}
                      startContent={<Icon icon="lucide:check" />}
                    >
                      Valider cette réalisation
                    </Button>
                  )}
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};