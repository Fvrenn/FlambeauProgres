import React from "react";
import { Button, cn } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";

type SidebarDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  panelClassName?: string;
};

export const SidebarDrawer = ({
  isOpen,
  onClose,
  children,
  panelClassName,
}: SidebarDrawerProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <motion.div
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          <motion.div
            animate={{ x: 0 }}
            className={cn(
              "relative flex h-full w-72 max-w-[80vw] flex-col z-10",
              panelClassName ?? "bg-background border-r-small border-divider",
            )}
            exit={{ x: "-100%" }}
            initial={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Button
              isIconOnly
              className="absolute top-2 right-2 z-50"
              variant="light"
              onPress={onClose}
            >
              <Icon icon="solar:close-circle-linear" width={24} />
            </Button>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
