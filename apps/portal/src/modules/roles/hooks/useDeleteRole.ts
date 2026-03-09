import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRole } from "../services";

export const useDeleteRole = () => {
    const queryClient = useQueryClient();

    const { isPending: isLoading, mutateAsync, error } = useMutation({
        mutationFn: deleteRole,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['roles'] });
        },
    });

    return { isLoading, error, remove: mutateAsync };
};
