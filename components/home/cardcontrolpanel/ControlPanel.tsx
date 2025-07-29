import React from "react";
import ControlPanelTabs from "./components/ControlPanelTabs";
import type { Badge } from "@/types/badge";
import "./test.css";

interface ControlPanelProps {
  badges: Badge[];
  selectedBadge: string | null;
}

const ControlPanel = ({ badges, selectedBadge }: ControlPanelProps) => {
  return (
    <div className="w-full h-full inline-flex flex-col test">
      <ControlPanelTabs badges={badges} selectedBadge={selectedBadge} />
    </div>
  );
};

export default ControlPanel;
