import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRole } from "../services";

export const useCreateRole = () => {
    const queryClient = useQueryClient();

    const { isPending: isLoading, mutateAsync, error } = useMutation({
        mutationFn: createRole,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['roles'] });
        },
    });

    return { isLoading, error, create: mutateAsync };
};
