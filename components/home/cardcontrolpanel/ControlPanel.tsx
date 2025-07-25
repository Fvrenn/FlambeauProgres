import React from "react";
import ControlPanelTabs from "./components/ControlPanelTabs";
import { BadgeComplete } from "@/lib/badges";
import "./test.css";

interface ControlPanelProps {
  badges: BadgeComplete[];
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
