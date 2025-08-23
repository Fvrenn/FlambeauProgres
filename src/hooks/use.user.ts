import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers} from '@/src/lib/user';
import type { User } from '@/src/types/user';

// Hook pour récupérer tous les utilisateurs
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook pour récupérer un utilisateur spécifique
// export const useUser = (id: string) => {
//   return useQuery({
//     queryKey: ['users', id],
//     queryFn: () => getUser(id),
//     enabled: !!id, // Ne lance la requête que si id existe
//   });
// };

// // Hook pour créer un utilisateur
// export const useCreateUser = () => {
//   const queryClient = useQueryClient();
  
//   return useMutation({
//     mutationFn: createUser,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['users'] });
//     },
//   });
// };

// // Hook pour mettre à jour un utilisateur
// export const useUpdateUser = () => {
//   const queryClient = useQueryClient();
  
//   return useMutation({
//     mutationFn: ({ id, data }: { id: string; data: Partial<User> }) => 
//       updateUser(id, data),
//     onSuccess: (data, variables) => {
//       // Mettre à jour le cache directement
//       queryClient.setQueryData(['users', variables.id], data);
//       // Invalider la liste des utilisateurs
//       queryClient.invalidateQueries({ queryKey: ['users'] });
//     },
//   });
// };

// // Hook pour supprimer un utilisateur
// export const useDeleteUser = () => {
//   const queryClient = useQueryClient();
  
//   return useMutation({
//     mutationFn: deleteUser,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['users'] });
//     },
//   });
// };