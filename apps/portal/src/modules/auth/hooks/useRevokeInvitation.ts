import { useMutation, useQueryClient } from "@tanstack/react-query";
import { revokeInvitation } from "../services";

export const useRevokeInvitation = () => {
    const queryClient = useQueryClient();
    const { isPending: isLoading, mutate, error } = useMutation({
        mutationFn: revokeInvitation,
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['invitations'] });
        },
    });

    return { isLoading, error, revoke: mutate };
};
