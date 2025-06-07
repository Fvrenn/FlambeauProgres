import React from "react";
import { Card, CardBody, CardFooter, Button, Image, Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from "@heroui/react";
import { Icon } from "@iconify/react";
import { mockUsers, mockBadges } from "../data/mock-data";

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
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      const user = mockUsers.find(u => u.id === userId);
      const userBadge = user?.badges.find(b => b.badgeId === badgeId);
      
      if (userBadge) {
        setRealisations(userBadge.realisations);
      }
      
      setIsLoading(false);
    }, 500);
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
        Aucune réalisation soumise pour ce badge
      </div>
    );
  }
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {realisations.map((realisation) => (
          <Card key={realisation.id} className="border border-divider">
            <CardBody className="p-0">
              <div className="relative h-48">
                <Image
                  removeWrapper
                  alt={realisation.title}
                  className="z-0 w-full h-full object-cover"
                  src={realisation.imageUrl}
                />
                {realisation.isValidated && (
                  <div className="absolute top-2 right-2 bg-success rounded-full p-1">
                    <Icon icon="lucide:check" className="text-white" />
                  </div>
                )}
              </div>
            </CardBody>
            <CardFooter className="flex flex-col items-start text-small">
              <div className="w-full">
                <h4 className="font-medium">{realisation.title}</h4>
                <p className="text-foreground-500 text-xs mt-1">
                  Soumis le {new Date(realisation.submittedAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
              
              <div className="flex justify-between w-full mt-3">
                <Button
                  size="sm"
                  variant="flat"
                  onPress={() => handleViewRealisation(realisation)}
                  startContent={<Icon icon="lucide:eye" />}
                >
                  Voir
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
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {selectedRealisation?.title}
              </ModalHeader>
              <ModalBody className="pb-6">
                <div className="mb-4">
                  <Image
                    alt={selectedRealisation?.title}
                    className="w-full object-contain max-h-[60vh]"
                    src={selectedRealisation?.imageUrl}
                  />
                </div>
                
                <p className="text-foreground-600">{selectedRealisation?.description}</p>
                
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