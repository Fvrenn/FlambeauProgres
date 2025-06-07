"use client" 
import React from "react";
import { Tabs, Tab } from "@heroui/react";
import { UserList } from "./components/user-list";
import { BadgeProgress } from "./components/badge-progress";
import { Header } from "./components/header";

export default function App() {
  const [selectedUser, setSelectedUser] = React.useState<string | null>(null);
  const [selectedBadge, setSelectedBadge] = React.useState<string | null>(null);
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex flex-1 flex-col md:flex-row">
        <div className="w-full md:w-1/3 lg:w-1/4 p-4 border-r border-divider">
          <UserList 
            selectedUser={selectedUser} 
            onSelectUser={setSelectedUser} 
          />
        </div>
        <div className="flex-1 p-4">
          {selectedUser ? (
            <BadgeProgress 
              userId={selectedUser} 
              selectedBadge={selectedBadge}
              onSelectBadge={setSelectedBadge}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center p-8">
                <h2 className="text-xl font-medium text-foreground-600">
                  Sélectionnez un chef pour voir sa progression
                </h2>
                <p className="text-foreground-400 mt-2">
                  Vous pourrez consulter et valider les compétences et réalisations
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}