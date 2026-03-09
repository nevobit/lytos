import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateScalationRule } from "../services";

export const useUpdateScalationRule = () => {
    const queryClient = useQueryClient();

    const { isPending: isLoading, mutate, error } = useMutation({
        mutationFn: updateScalationRule,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['scalationRules'] });
        },
    });

    return { isLoading, error, update: mutate };
};