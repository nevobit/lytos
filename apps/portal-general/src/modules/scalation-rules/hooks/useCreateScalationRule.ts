import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createScalationRule } from "../services";

export const useCreateScalationRule = () => {
    const queryClient = useQueryClient();

    const { isPending: isLoading, mutateAsync, error } = useMutation({
        mutationFn: createScalationRule,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['scalationRules'] });
        },
    });

    return { isLoading, error, create: mutateAsync };
};