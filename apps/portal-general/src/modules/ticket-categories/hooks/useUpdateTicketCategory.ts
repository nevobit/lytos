import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTicketCategory } from "../services";

export const useUpdateTicketCategory = () => {
    const queryClient = useQueryClient();

    const { isPending: isLoading, mutate, error } = useMutation({
        mutationFn: updateTicketCategory,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['ticketCategories'] });
        },
    });

    return { isLoading, error, update: mutate };
};