import React from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";

type SidebarDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export const SidebarDrawer = ({ isOpen, onClose, children }: SidebarDrawerProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer Content */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative flex h-full w-72 max-w-[80vw] flex-col bg-background border-r-small border-divider z-10"
          >
            <Button
              isIconOnly
              variant="light"
              className="absolute top-2 right-2 z-50"
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
