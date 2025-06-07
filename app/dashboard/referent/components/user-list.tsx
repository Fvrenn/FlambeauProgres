import React from "react";
import { Card, CardBody, Input, Chip, Avatar } from "@heroui/react";
import { Icon } from "@iconify/react";
import { mockUsers } from "../data/mock-data";

interface UserListProps {
  selectedUser: string | null;
  onSelectUser: (userId: string) => void;
}

export const UserList: React.FC<UserListProps> = ({ selectedUser, onSelectUser }) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  
  const filteredUsers = React.useMemo(() => {
    return mockUsers.filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-4">Chefs Flambeaux</h2>
      
      <div className="mb-4">
        <Input
          placeholder="Rechercher un chef..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          startContent={<Icon icon="lucide:search" className="text-default-400" />}
        />
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-3">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-8 text-foreground-400">
            Aucun chef trouvé
          </div>
        ) : (
          filteredUsers.map(user => (
            <Card 
              key={user.id}
              isPressable
              isHoverable
              className={`border ${selectedUser === user.id ? 'border-primary' : 'border-divider'}`}
              onPress={() => onSelectUser(user.id)}
            >
              <CardBody className="flex flex-row items-center p-3">
                <Avatar src={user.avatar} name={user.name} className="mr-3" />
                <div className="flex-1">
                  <p className="font-medium">{user.name}</p>
                  <div className="flex items-center mt-1">
                    <Chip 
                      size="sm" 
                      variant="flat" 
                      color={user.progress >= 75 ? "success" : user.progress >= 50 ? "warning" : "default"}
                      className="mr-2"
                    >
                      {user.progress}% complété
                    </Chip>
                    <span className="text-xs text-foreground-400">
                      {user.completedBadges} badges validés
                    </span>
                  </div>
                </div>
                <Icon 
                  icon="lucide:chevron-right" 
                  className={`text-xl ${selectedUser === user.id ? 'text-primary' : 'text-default-400'}`}
                />
              </CardBody>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};