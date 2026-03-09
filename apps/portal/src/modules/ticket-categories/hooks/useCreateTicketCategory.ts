import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTicketCategory } from "../services";

export const useCreateTicketCategory = () => {
    const queryClient = useQueryClient();

    const { isPending: isLoading, mutateAsync, error } = useMutation({
        mutationFn: createTicketCategory,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['ticketCategories'] });
        },
    });

    return { isLoading, error, create: mutateAsync };
};