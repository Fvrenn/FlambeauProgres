import React from "react";
import { Card, CardBody, Input, Chip, Avatar } from "@heroui/react";
import { Icon } from "@iconify/react";
import { fetchUsers, User } from "../../../services/api.service";

interface UserListProps {
  selectedUser: string | null;
  onSelectUser: (userId: string) => void;
}

export const UserList: React.FC<UserListProps> = ({ selectedUser, onSelectUser }) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [users, setUsers] = React.useState<User[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true);
        const userData = await fetchUsers();
        setUsers(userData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur lors du chargement");
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);
  
  const filteredUsers = React.useMemo(() => {
    return users.filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <h2 className="text-xl font-semibold mb-4">Chefs Flambeaux</h2>
        <div className="flex justify-center items-center flex-1">
          <div className="animate-spin">
            <Icon icon="lucide:loader" className="text-2xl text-primary" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full">
        <h2 className="text-xl font-semibold mb-4">Chefs Flambeaux</h2>
        <div className="text-center py-8 text-danger">
          {error}
        </div>
      </div>
    );
  }

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
              className={`border ${selectedUser === user.id.toString() ? 'border-primary' : 'border-divider'}`}
              onPress={() => onSelectUser(user.id.toString())}
            >
              <CardBody className="flex flex-row items-center p-3">
                <Avatar name={user.name} className="mr-3" />
                <div className="flex-1">
                  <p className="font-medium">{user.name}</p>
                  <div className="flex items-center mt-1">
                    <Chip 
                      size="sm" 
                      variant="flat" 
                      color="default"
                      className="mr-2"
                    >
                      {user.role}
                    </Chip>
                    <span className="text-xs text-foreground-400">
                      {user.email}
                    </span>
                  </div>
                </div>
                <Icon 
                  icon="lucide:chevron-right" 
                  className={`text-xl ${selectedUser === user.id.toString() ? 'text-primary' : 'text-default-400'}`}
                />
              </CardBody>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};