import React from "react";
import { Home, ChatRoundLine, RoundGraph } from "@solar-icons/react";
import type { Badge } from "@/src/types/badge";

interface Competence {
  code: string;
  description: string;
}

interface TabNavigationProps {
  badge: Badge;
  competence: Competence;
  activeTab: "justification" | "commentaire" | "statut";
  onTabChange: (tab: "justification" | "commentaire" | "statut") => void;
}

const tabs = [
  { key: "justification", label: "Justification", icon: Home },
  { key: "commentaire", label: "Commentaire", icon: ChatRoundLine },
  { key: "statut", label: "Statut", icon: RoundGraph },
];

export default function TabNavigation({
  badge,
  competence,
  activeTab,
  onTabChange,
}: TabNavigationProps) {
  return (
    <aside className="flex flex-col w-80 border-r border-gray-200 pr-4 bg-background rounded-l-lg px-8 py-11">
      <span className="font-medium text-base mb-9">
        Etapes {badge.name}
      </span>

      <div className="pl-2 mb-4">
        <p className="mb-11 text-base font-medium ">
          {competence.code} :&nbsp;
          {competence.description}
        </p>
      </div>
      
      <nav>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              className={`
                w-full text-left px-4 py-2 mb-2 rounded-xl transition-colors font-normal flex items-center gap-2
                ${
                  activeTab === tab.key
                    ? "bg-light-beige text-black"
                    : "hover:bg-medium-black hover:text-white text-gray-700"
                }
              `}
              onClick={() =>
                onTabChange(tab.key as typeof activeTab)
              }
            >
              {Icon && <Icon size={18} />}
              {tab.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}