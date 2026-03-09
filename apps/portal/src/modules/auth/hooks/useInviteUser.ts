import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inviteUser } from "../services";

export const useInviteUser = () => {
    const queryClient = useQueryClient();

    const { isPending: isLoading, mutate, error } = useMutation({
        mutationFn: inviteUser,
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['invitations'] });
        },
    });

    return { isLoading, error, invite: mutate };
};
