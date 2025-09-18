import {
  Modal,
  ModalContent,
  ModalBody,
} from "@heroui/modal";
import React, { useState, useEffect } from "react";
import type { Badge } from "@/src/types/badge";
import { useMaModalLogic } from "@/src/hooks/useMaModalLogic";
import SubmitConfirmModal from "./ConfirmModal";
import TabNavigation from "./TabNavigation";
import JustificationTab from "./JustificationTab";
import CommentaireTab from "./CommentaireTab";
import StatutTab from "./StatutTab";

interface MaModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  competence: {
    code: string;
    description: string;
    type: "COMPETENCE" | "REALISATION";
    fichiersRequis?: boolean;
  };
  badge: Badge;
}

export default function MaModal({
  isOpen,
  onOpenChange,
  competence,
  badge,
}: MaModalProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const modalLogic = useMaModalLogic({
    badge,
    competence,
    isOpen,
  });

  const {
    form,
    statut,
    uploadedFiles,
    activeTab,
    isSubmitting,
    setActiveTab,
    handleFieldChange,
    handleSelectionChange,
    handleFileUpload,
    removeFile,
    handleSubmitWithConfirm,
    autoSave,
    initializeForm,
  } = modalLogic;

  const handleModalClose = (open: boolean) => {
    if (!open && isOpen) {
      autoSave();
    }
    onOpenChange(open);
  };

  useEffect(() => {
    initializeForm();
  }, [isOpen, competence.code, modalLogic.draft]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "justification":
        return (
          <JustificationTab
            form={form}
            competence={competence}
            uploadedFiles={uploadedFiles}
            isSubmitting={isSubmitting}
            statut={statut}
            onFieldChange={handleFieldChange}
            onSelectionChange={handleSelectionChange}
            onFileUpload={handleFileUpload}
            onRemoveFile={removeFile}
            onConfirmSubmit={() => setIsConfirmOpen(true)}
          />
        );
      case "commentaire":
        return <CommentaireTab />;
      case "statut":
        return (
          <StatutTab
            badge={badge}
            competence={competence}
            form={form}
            statut={statut}
            uploadedFiles={uploadedFiles}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <SubmitConfirmModal
        isOpen={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onConfirm={async () => {
          const success = await handleSubmitWithConfirm();
          if (success) {
            setIsConfirmOpen(false);
          }
        }}
      />
      <Modal isOpen={isOpen} onOpenChange={handleModalClose} size="5xl">
        <ModalContent>
          <ModalBody className="p-0">
            <div className="flex min-h-[250px]">
              <TabNavigation
                badge={badge}
                competence={competence}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
              <div className="flex-1 px-8 pt-12 pb-6">
                <div>{renderTabContent()}</div>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
