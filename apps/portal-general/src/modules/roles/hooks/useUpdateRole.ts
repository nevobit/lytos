import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRole } from "../services";

export const useUpdateRole = () => {
    const queryClient = useQueryClient();

    const { isPending: isLoading, mutate, error } = useMutation({
        mutationFn: updateRole,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['roles'] });
        },
    });

    return { isLoading, error, update: mutate };
};
