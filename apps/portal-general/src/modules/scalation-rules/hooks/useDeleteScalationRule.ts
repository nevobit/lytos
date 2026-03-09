import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteScalationRule } from "../services";

export const useDeleteScalationRule = () => {
    const queryClient = useQueryClient();

    const { isPending: isLoading, mutate, error } = useMutation({
        mutationFn: deleteScalationRule,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['scalationRules'] });
        },
    });

    return { isLoading, error, remove: mutate };
};