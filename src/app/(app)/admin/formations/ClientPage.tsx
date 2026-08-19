"use client";

import type { FormationCard } from "@prisma/client";

import React from "react";
import { Image } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

import { deleteFormation } from "../_actions/admin.actions";

import FormationModal from "./_components/FormationModal";

import { Button, Card, CardBody } from "@/components/ui";

type FormationsClientPageProps = {
  formations: FormationCard[];
};

export default function FormationsClientPage({
  formations,
}: FormationsClientPageProps) {
  const router = useRouter();
  const [selectedFormation, setSelectedFormation] =
    React.useState<FormationCard | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleCreate = () => {
    setSelectedFormation(null);
    setIsModalOpen(true);
  };

  const handleEdit = (formation: FormationCard) => {
    setSelectedFormation(formation);
    setIsModalOpen(true);
  };

  const handleDelete = async (formationId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette carte ?")) {
      await deleteFormation(formationId);
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-extrabold">Gestion de la Formation</h1>
        <div>
          <Button
            className="!bg-nav-active hover:!bg-nav-hover !text-white cursor-pointer"
            color="success"
            endIcon="solar:add-circle-linear"
            onClick={handleCreate}
          >
            Nouvelle formation
          </Button>
        </div>
      </div>

      {formations.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-10 text-default-400 border border-dashed border-dashboard-border rounded-large">
          <Icon className="text-3xl" icon="solar:gallery-add-linear" />
          <p className="text-sm">Aucune carte de formation pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {formations.map((formation) => (
            <Card
              key={formation.id}
              className="p-0 overflow-hidden h-[270px] bg-dashboard-panel"
              size="sm"
            >
              {/* Zone image — 160px, arrondie en haut seulement */}
              <div
                className="w-full shrink-0 bg-dashboard-card border-b border-dashed border-dashboard-border overflow-hidden"
                style={{ height: 160, borderRadius: "22px 22px 0 0" }}
              >
                {formation.imageUrl ? (
                  <Image
                    removeWrapper
                    alt={formation.titre}
                    className="w-full h-full object-cover rounded-none"
                    src={formation.imageUrl}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-1 text-default-400">
                    <Icon className="text-2xl" icon="solar:gallery-linear" />
                    <span className="text-xs">training visual</span>
                    <span className="text-xs">
                      or{" "}
                      <span className="text-primary underline cursor-pointer">
                        browse files
                      </span>
                    </span>
                  </div>
                )}
              </div>

              {/* Corps de la card — 110px, fond blanc, padding 18 20 20 */}
              <CardBody
                className="gap-3 flex-col justify-between bg-dashboard-panel"
                style={{
                  height: 110,
                  padding: "18px 20px 20px",
                  flexShrink: 0,
                }}
              >
                <p
                  className="line-clamp-2"
                  style={{ fontSize: 17, fontWeight: 700 }}
                >
                  {formation.titre}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    fullWidth
                    className="!bg-[#eee7d3] hover:!bg-[#f0ead8] !rounded-[12px] !text-[13px] !font-semibold cursor-pointer"
                    color="default"
                    size="sm"
                    variant="solid"
                    onClick={() => handleEdit(formation)}
                  >
                    Modifier
                  </Button>
                  <Button
                    className="!bg-[#fbe4b8] hover:!bg-[#fbe7c2] !rounded-[12px] !text-[13px] !font-semibold !text-[#8a5a1f] cursor-pointer"
                    color="primary"
                    size="sm"
                    variant="solid"
                    onClick={() => handleDelete(formation.id)}
                  >
                    Suppr.
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <FormationModal
        formation={selectedFormation}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
