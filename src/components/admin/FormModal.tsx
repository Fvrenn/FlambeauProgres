"use client";

import type { ModalProps } from "@heroui/react";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";

import { Button } from "@/components/ui";

type FormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  title: string;
  submitLabel: string;
  isPending?: boolean;
  size?: ModalProps["size"];
  scrollBehavior?: ModalProps["scrollBehavior"];
  children: React.ReactNode;
};

export function FormModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  submitLabel,
  isPending = false,
  size,
  scrollBehavior,
  children,
}: FormModalProps) {
  return (
    <Modal
      classNames={{ base: "rounded-[24px]" }}
      isOpen={isOpen}
      scrollBehavior={scrollBehavior}
      size={size}
      onClose={onClose}
    >
      <ModalContent>
        {(close) => (
          <form onSubmit={onSubmit}>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody>{children}</ModalBody>
            <ModalFooter>
              <Button color="danger" variant="ghost" onClick={close}>
                Annuler
              </Button>
              <Button color="primary" isLoading={isPending} type="submit">
                {submitLabel}
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
