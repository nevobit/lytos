import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTicketCategory } from "../services";

export const useDeleteTicketCategory = () => {
    const queryClient = useQueryClient();

    const { isPending: isLoading, mutate, error } = useMutation({
        mutationFn: deleteTicketCategory,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['ticketCategories'] });
        },
    });

    return { isLoading, error, remove: mutate };
};